const
  express = require(`express`),
  router  = new express.Router();

// Require controllers:
var
  callersCtrl = require(`../controllers/callers_controller.js`),
  usersCtrl = require(`../controllers/users_controller.js`);

// Require token authentication:
const token = require(`../config/token_auth.js`);

// /api/users routes:
router.post(`/users`,
    // Log:
    function(req, res, next) {
      console.log();
      console.log(`Request received to create user.`.blue);
      next();
    },

    // Validations:
    usersCtrl.user.checkForFields,
    usersCtrl.user.validatePassword,
    usersCtrl.user.checkIfAlreadyExists,

    // Create new user:
    usersCtrl.create
  );

router.get(`/users`,
    function(req, res, next) {
      console.log();
      console.log("Nearly correct request received:".blue, req.method, req.originalUrl);
      next({code: 404, message: 'Try POST!'});
    }
  )

// /api/me routes:
router.route(`/me`)
  .get(
    function(req, res, next) {
      console.log();
      console.log("Request received to get user info.".blue);
      next();
    },

    // Validations:
    usersCtrl.auth.checkForTokenInHeader,
    usersCtrl.auth.validateToken,

    // Show current user:
    usersCtrl.me
  )

// /api/token routes:
router.route(`/token`)
  .post(
    // Log
    function(req, res, next) {
      console.log();
      console.log("Request received to create token.".blue);
      next();
    },

    // validations
    token.token.checkCredentials,
    token.token.checkUserExists,
    token.token.validateCredentials,

    // create a new token
    token.create
  )
  .get(
    function(req, res, next) {
      console.log();
      console.log("Nearly correct request received:".blue, req.method, req.originalUrl);
      next({code: 404, message: 'Try POST!'});
    }
  );

router.use('/tokens', function(req, res, next) {
  console.log();
  console.log("Nearly correct request received:".blue, req.method, req.originalUrl);
  next({
    code:    404,
    message: 'Use a singular token, for a singular resource (and POST).'
  });
})

// /api/callers routes:
router.route(`/callers`)
  .get(callersCtrl.index)
  .post(callersCtrl.create)

// /api/callers/:id routes:
router.route(`/callers/:id`)
  .get(callersCtrl.show)
  .post(callersCtrl.update)
  .delete(callersCtrl.destroy)

module.exports = router
