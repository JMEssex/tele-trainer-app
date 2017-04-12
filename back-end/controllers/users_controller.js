var jwt     = require('jsonwebtoken'),
    moment  = require('moment');

var User = require('../models/user');

module.exports = {
  create: create,
  me:     me,
  user: {
    checkForFields:       checkForFields,
    validatePassword:     validatePassword,
    checkIfAlreadyExists: checkIfAlreadyExists
  },
  auth: {
    checkForTokenInHeader: checkForTokenInHeader,
    validateToken:         validateToken
  }
};

function create(req, res, next) {
  console.log('  Creating user!'.yellow);

  req.body.dob = Date.parse(req.body.dob);
  User
    .create(req.body)
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully created user.',
        data: {
          email: user.email,
          id:    user._id
        }
      });
    }).catch(function(err) {
      next(err);
    });
}

// Essentially, a "me" route is a show route, for the current user.
function me(req, res, next) {
  console.log('  Retrieving user!'.yellow);

  User
    .findOne({email: req.decoded.email}).exec()
    .then(function(user) {
      res.json({
        success: true,
        message: 'Successfully retrieved user data.',
        data: user
      });
    })
    .catch(function(err) {
      next(err);
    });
}

// ************************* USER VALIDATIONS *************************

function checkForFields(req, res, next) {
  console.log('  Begin validating user creation:'.yellow);

  if (
    !req.body.email    ||
    !req.body.name     ||
    !req.body.password ||
    !req.body.dob
  ) {
    next({
      status:  422,
      message: 'Missing required field: one of email, name, password, or dob'
    });
  } else {
    console.log("  All fields present…".green);
    next();
  }
}

function validatePassword(req, res, next) {
  if (req.body.password.length < 5) {
    next({
      status:  422,
      message: 'Password field must have minimum of 5 characters'
    });
  } else {
    console.log("  Password validated:".green, req.body.password);
    next();
  }
}

// function validateDob(req, res, next) {
//   var date = moment(req.body.dob, moment.ISO_8601);
//   var eighteen_years_ago =
//     moment().subtract(18, 'years').startOf('day');
//
//   var valid = date.isValid();
//   var flags = date.parsingFlags();
//
//   if (!valid && !flags.iso) {
//     next({
//       status:  422,
//       message: 'dob invalid format: not in ISO 8601. ' +
//       'See https://en.wikipedia.org/wiki/ISO_8601#Dates.',
//     });
//   } else
//   if (!valid && (flags.overflow !== -1)) {
//     next({
//       status:  422,
//       message: 'dob invalid date part: year, month, or date.',
//     });
//   } else
//   if (date.isAfter(eighteen_years_ago)) {
//     next({
//       status:  422,
//       message: 'dob invalid: you must be 18 to enter.',
//     });
//   } else {
//     console.log("  Date of birth validated:".green, req.body.dob);
//     next();
//   }
// }

function checkIfAlreadyExists(req, res, next) {
  User
    .find({email: req.body.email}).exec()
    .catch(function(err) {
      next(err);
    })
    .then(function(users) {
      if (users.length > 0) {
        next({
          status:  409,
          message: 'A user with this email already exists',
        });
      } else {
        console.log("  User doesn't exist yet…".green, req.body.email);
        next();
      }
    });
}

// ************************* AUTH VALIDATIONS *************************

function checkForTokenInHeader(req, res, next) {
  var authHeader = req.get('Authorization'),
      method,
      token;

  console.log('  Begin authorizing request:'.yellow);

  // conditionally set all the variables...
  if (authHeader) {
    authHeader = authHeader.split(' ');
    console.log("  The header 'Authorization' has been found.".green);
  }
  if (authHeader && authHeader.length > 0) {
    method = authHeader[0];
  }
  if (authHeader && authHeader.length > 1) {
    token = authHeader[1];
  }

  if (!authHeader) {
    if (req.session.missingAuth) {
      req.session.missingAuth++;
    } else {
      req.session.missingAuth = 1;
    }
    console.log(`  Failed attempt:`.green, req.session.missingAuth);
    if (req.session.missingAuth < 10) {
      var message = 'Authorization failed (invalid_request): missing necessary header. ' +
                    'See https://tools.ietf.org/html/rfc6750#section-2.1';
    } else {
      var message = "Add a header 'Authorization': '...', where the second " +
                    "part is a string of your method and token: 'Method token.token.token'";
    }
    next({
      status:  400,
      message: message
    });
  } else
  if (method.toLowerCase() !== 'bearer' && method.toLowerCase() !== 'token') {
    next({
      status:  400,
      message: 'Authorization failed (invalid_request): Authorization method ' +
      'must be \'Bearer\' or \'Token\''
    });
  } else
  if (!token) {
    next({
      status:  401,
      message: 'Authorization failed (invalid_token): token missing.'
    });
  } else {
    // add the token to the request
    console.log("  Token found in header:".green, token.substring(0,20) + '…');
    req.token = token;
    next();
  }
}

function validateToken(req, res, next) {
  jwt.verify(req.token, process.env.SECRET_KEY, function(err, decoded) {
    if (err && err.name === 'TokenExpiredError') {
      next({
        status:  401,
        message: 'Authorization failed (invalid_token): token expired at ' + err.expiredAt + '.'
      });
    } else
    if (err) {
      next({
        status:  401,
        message: 'Authorization failed (invalid_token): token malformed.'
      });
    } else {
      // add the decoded token to the request
      console.log("  Token validated and decoded…".green);
      console.log("  See decoded values at http://jwt.io/?value=" + req.token);
      req.decoded = decoded;
      next();
    }
  });
}
