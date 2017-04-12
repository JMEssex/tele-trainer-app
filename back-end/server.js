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
// app.use(favicon(path.join(__dirname, `public`, `ga-favicon.ico`)));
// app.use(express.static(path.join(__dirname, `public`)));

// Parse the cookie, retrieve the session; load it on to the request:
app.use(cookieParser(`howsecretshouldthisbeanyways`));
app.use(session({
  secret: `hopefullynobodyfindsthisinmysourcecode`,
  saveUninitialized: true,
  resave: true
}));


/////// *** API ROUTES *** ///////

app.use(debugReq); // Helper function below.

// Root path: returns a list of possible requests:
app.get(`/api`, function(req, res, next) {
  console.log(); // initialized console spaceing.
  console.log(`Request made to API root.`.blue);
  var baseURI = `${req.protocol}:\/\/${req.get('host')}\/api`;
  res.json({
    token_url: `POST ${baseUri}/token`,
    user_urls: [
      `POST ${baseUri}/users`,
      `GET  ${baseUri}/me`
    ]
  });
});

// VALIDATION: Check for correctly formed requests (content type).
app.use([`/api/users`, `/api/token`], function(req, res, next) {
  if (req.get(`Content-Type`) === `application/x-www-form-urlencoded`) {
    next({
      status:  400,
      message: `Make sure you are not setting your request body to be x-www-form-urlencoded. Use application/json (raw)`
    })
  } else if (req.get(`Content-Type`) !== `application/json`) {
    if (req.session.failedToSetContentType) {
      req.session.failedToSetContentType++;
    } else {
      req.session.failedToSetContentType = 1;
    }
    console.log();
    console.log(`Request made without correct content type.`.blue, req.method, req.originalUrl);
    console.log(`  Failed attempt:`.green, req.session.failedToSetContentType);
    if (req.session.failedToSetContentType < 10) {
      var message = `Request body must be JSON. Set your headers; see ` +
        `http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17`;
    } else {
      var message = `Add a header where 'Content-Type': 'application/json', and make sure that the body is formatted as 'raw', if it exists`;
    }
    next({
      status:  400,
      message: message
    });
  } else {
    next();
  }
});

// VALIDATION: Check that the body is correctly formatted before failing to parse (replies with good errors for JSON parsing).
// app.use('/api', bodyParser.json());
app.use(
  [`/api/users`, `/api/token`],
  bodyParser.text({type: `*/*`}),
  function(req, res, next) {
  if (req.body) {
    try {
      req.body = JSON.parse(req.body);
    } catch (err) {
      console.log(); // Added console spaceing:
      console.log(`Request has a JSON body that is incorrectly formatted and failed parsing.`.blue);
      next({
        status:  400,
        message: `Body failed to be parsed. JSON incorrectly formatted.`
      });
    }
  }
  next();
});

// // Make json objects available in requests:
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))

// Mount routes at /api:
app.use(`/api`, routes);


/////// *** ERROR ROUTES *** ///////

// Catches all 404 routes, either for non-existing routes or routes that have passed to it:
app.use(function(req, res, next) {
  next({status: 404});
});

// Error-handeling layer:
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
