var
  express      = require(`express`)           ,
  path         = require(`path`)              ,
  favicon      = require(`serve-favicon`)     ,
  logger       = require(`morgan`)            ,
  bodyParser   = require(`body-parser`)       ,
  session      = require(`express-session`)   ,
  cookieParser = require(`cookie-parser`)     ,
  debug        = require(`debug`)(`app:http`) ,
  colors       = require(`colors`)


/////// *** SETUP *** ///////

// Load env variable from .env file:
require('dotenv').config();
var env    = require(`./config/environment.js`);
var routes = require(`./config/routes.js`  );

// Establish connection to mongo database:
var mongoose = require(`./config/database.js`);

// Define JWTs local environment variables in express:
var app = express();

app.set(`title`, env.TITLE);
app.set(`safe-title`, env.SAFE_TITLE);

app.set(`secret-key`, env.SECRET_KEY);

app.locals.title = app.get(`title`);

/////// *** MIDDLEWARE *** ///////

// CORS (allows the seprate client to send requests)…
app.use(function(req, res, next) {
  res.header(`Access-Control-Allow-Origin` , `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type,Authorization`);

  // Handle "preflight" requests:
  if (`OPTIONS` == req.method) {
    res.send(200);
  } else {
    next();
  }
});

// Log requests made to the app:
app.use(logger(`dev`));

// // Sets the favicon ;-)
app.use(favicon(path.join(__dirname, `front-end`, `favicon.ico`)));
app.use(express.static(path.join(__dirname, `front-end`)));

// Parse the cookie, retrieve the session; load it on to the request:
app.use(cookieParser());
app.use(bodyParser.json());
app.use(debugReq); // Helper function below.

/////// *** API ROUTES *** ///////

// VALIDATION: Check for correctly formed requests (content type).
app.use(validateContentType);

// Mount routes at /api:
app.use(`/api`, routes);

/////// *** ERROR ROUTES *** ///////

// Catches all 404 routes, either for non-existing routes or routes that have passed to it:
app.use(function(req, res, next) {
  var err = new Error(`404 Not Found`);
  err.status = 404;
  next(err);
});

// Error-handeling layer:
app.use(addFailedAuthHeader)
app.use(function(err, req, res, next) {
  delete err.statusCode;

  switch(err.status) {
    case 400: err.title = `400 Bad Request`;  break;
    case 401: err.title = `401 Unauthorized`; break;
    case 403: err.title = `403 Forbidden`;    break;
    case 404: err.title = `404 Not Found`;    break;
    case 409: err.title = `409 Conflict`;     break;
    case 422: err.title = `422 Unprocessable Entity`; break;
    default:
      err.status = 500;
      err.title  = `500 Internal Server Error`;
  }

  console.log(`  >>> Error!`.red);
  console.log(err);
  res.status(err.status).json(err);
});

/////// *** HELPER FUNCTIONS *** ///////

// If the request is one of PUT, PATCH or POST, and has a body that is
// not empty, and does not have an application/json Content-Type header, then …
function validateContentType(req, res, next) {
  var methods = [`PUT`, `PATCH`, `POST`];
  if (
    methods.indexOf(req.method) !== -1 &&
    Object.keys(req.body).length !== 0 &&
    !req.is(`json`)
  ) {
    var message = `Content-Type header must be application/json.`.yellow;
    res.status(400).json(message);
  } else {
    next();
  }
}

// When there is a 401 Unauthorized, the repsonse shall include a header
// WWW-Authenticate that tells the client how they must authenticate
// their requests:
function addFailedAuthHeader(err, req, res, next) {
  var header = {"WWW-Authenticate": "Bearer"}; // Must not use ``<-(ticks) around 'WWW-Authenticate'
  if (err.status === 401) {
    if (err.realm) header["WWW-Authenticate"] += ` realm="${err.realm}"`;
    res.set(header);
  }
  next(err);
}

function debugReq(req, res, next) {
  debug(`Debugging request data:`.red);
  debug(`headers:`.yellow);
  debug(req.headers);
  debug(`params:`.yellow);
  debug(req.params);
  debug(`query:`.yellow);
  debug(req.query);
  debug(`body:`.yellow);
  debug(req.body);
  next();
}

module.exports = app;
