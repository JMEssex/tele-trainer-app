const
  jwt     = require('jsonwebtoken'),
  moment  = require('moment'),
  colors  = require('colors');

const User = require('../models/User');


module.exports = {
  create: create,
  refresh: refresh,
  authenticate: authenticate,
  token: {
    checkCredentials:    checkCredentials,
    checkUserExists:     checkUserExists,
    validateCredentials: validateCredentials
  }
};

// ************************** TOKEN STRUCTURE **************************

// Defines the JWTs contents, or payload, given a user object. Make
// changes to what your token looks like here.
function extractPayload(user, options) {
  return {
    email: user.email,
    name: user.name,
    use: 'public_api'
  };
}

// Sets any options for token creation (using the node-jsonwebtoken
// library). See also: https://github.com/auth0/node-jsonwebtoken
var jwtOptions = {
  algorithm: 'HS256',
  expiresIn: '7 days'
};

// ******************************** API ********************************

/**
  * Creates a JWT and returns it to the user in the response.
  * It acts as Express middleware, and returns one of:
  *
  * 1.  Status 422 Unprocessable Entity (when missing id/email or password)
  *     - https://tools.ietf.org/html/rfc4918#section-11.2
  * 2.  Status 403 Forbidden (when the user can't be find or password fails)
  *     - https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.4
  * 3.  Status 200 OK
  *     - The response body contains the token that was generated.
  **/
function create(req, res, next) {
  if (!req.body.email || !req.body.password) {
    var message = 'Missing required fields: email and/or password';
    return res.status(422).json(message);
  }
  User
    .findOne({email: req.body.email}).exec()
    .then(function(user) {
      if (!user || !user.verifyPasswordSync(req.body.password)) {
        var message = 'User not found or password incorrect.';
        return res.status(403).json(message);
      }

      var token = generateJwt(user);

      res.json(token);
    });
}

/**
  * Creates a new JWT for an authenticated user (using the authenticate
  * method below) and returns it.
  **/
function refresh(req, res, next) {
  User
    .findById(req.decoded._id).exec()
    .then(function(user) {
      var token = generateJwt(user);

      res.json(token);
    });
}

/**
  * Authenticates a given request, based on whether or not there is a JWT
  * found in the request.
  *
  * It acts as Express middleware, and adds the decoded token to
  * req.decoded if successful. If it fails to find a token, it sends a
  * 401 Unauthorized response:
  *
  * - https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2
  *
  * Note: in this case (and in others), the use of Authorization is a
  * misnomer – it's being used to refer to authentication.
  **/
function authenticate(req, res, next) {
  var token = findTokenInAuthHeader(req);
  if (!token) return next({status: 401, message: 'Authenticate with token.'});

  verifyJwtAndHandleErrors(token, next, function(decoded) {
    req.decoded = decoded;
    next();
  });
}

// ****************************** HELPERS ******************************

function generateJwt(user, options) {
  console.log('  Generating token!'.yellow);
  return jwt.sign(
    extractPayload(user, options),
    process.env.SECRET_KEY,
    jwtOptions
  );
 }

/**
  * Searches for well formatted tokens, first in the request header
  * (the best, standard way of doing it) and then in the URI, in the form
  * …?token=xxx.xxx.xxx.
  *
  * Returns a token string or undefined if none found.
  **/
 function findTokenInAuthHeader(req) {
   var token;

   var header = req.get('Authorization');
   if (!header) header = req.get('Authorisation');

   if (header) {
     var match = header.match(/(bearer|token) (.*)/i);
     token = match ? match[2] : match;
   }

   if (!token) {
     token = req.query.token;
   }

   return token;
 }

/**
  * Verifies that a given token is correct, and returns clear messages
  * when verification fails. Uses next(err) instead of a simple
  * res.status().json() to make use of the 401 error handler in the
  * server's middleware stack (if it exists).
  **/
  function verifyJwtAndHandleErrors(token, next, cb) {
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (err && err.name === 'TokenExpiredError') {
        next({
          status:  401,
          message: 'Authorization failed (invalid_token): token expired.'
        });
      } else if (err) {
        next({
          status:  401,
          message: 'Authorization failed (invalid_token): token malformed.'
        });
      } else {
        cb(decoded);
      }
    });
  }


 // **************************** VALIDATIONS ****************************

function checkCredentials(req, res, next) {
  console.log('  Begin validating token creation:'.yellow);

  if (
    !req.body.email    ||
    !req.body.password
  ) {
    next({
      status:  422,
      message: 'Missing required fields: email and/or password'
    });
  } else {
    console.log("  All fields present…".green);
    next();
  }
}

function checkUserExists(req, res, next) {
  User
    .findOne({email: req.body.email}).exec()
    .catch(function(err) {
      next(err);
    }).then(function(user) {
      if (!user) {
        next({
          status:  401,
          message: 'Authentication failed: user does not exist'
        });
      } else {
        console.log(
          "  User found and added to req:".green,
          user.email + ",",
          user.name
        );
        // add user to request!
        req.user = user;
        next();
      }
    });
}

 function validateCredentials(req, res, next) {
   req.user.verifyPassword(req.body.password, function(err, valid) {
     if (!valid) {
       next({
         status:  401,
         message: 'Authentication failed: credentials incorrect'
       });
     } else {
       console.log("  Password verified:".green, req.body.password);
       next();
     }
   });
 }
