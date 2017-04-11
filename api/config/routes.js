const
  express = require(`express`)
  router  = express.Router(),
  callersController = require(`../controllers/callers_controller.js`)

// /api/callers/ routes:
router.route(`/callers/`)
  .get(callersController.index)
  .post(callersController.create)

// /api/callers/:id routes:
router.route(`/callers/:id`)
  .get(callersController.show)
  .post(callersController.update)
  .delete(callersController.destroy)

module.exports = router
