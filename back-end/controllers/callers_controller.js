const Caller = require(`../models/Caller.js`);

// GET /api/callers
// INDEX action to display all callers:
function index(req, res) {
  Caller.find({}, function(err, callers) {
    // Return 404 if there's an error:
    if (err) res.status(404).send(err)

    // otherwise send json back with 200 success header:
    res.status(200).send(callers)
  })
}

// POST /api/callers
// CREATE action to add a new caller.
function create(req, res, next) {
  var caller = new Caller(req.body)

  caller.save(function(err, caller) {
    // Return 500 if there's an internal error:
    if (err) res.status(500).send(err)

    // Otherwise send caller json back with 201 create success header:
    res.status(201).send(caller)
  })
}

// GET /api/callers/:id
// SHOW action to return a single caller:
function show(req, res) {
  Caller.find({_id: req.params.id}, function(err, caller) {
    // Return 404 if there's an error:
    if (err) res.status(404).send(err);

    // Otherwise send caller json back with 200 success header:
    res.status(200).send(caller)
  })
}

// PATCH /api/callers/:id
// UPDATE action to update a single caller:
function update(req, res) {
  Caller.findById({_id: req.params.id}, function(err, caller) {
    // Return 404 if caller not found:
    if (err) res.status(404).send(err)

    // Only update attributes submitted, don't null anything out:
    if (req.body.name) caller.name = req.body.name
    if (req.body.callLog) caller.callLog = req.body.callLog

    caller.save(function(err) {
      // Return 500 if there's an error:
      if (err) res.status(500).send(err)

      // Otherwise send caller json back with 200 success header:
      res.status(200).send(caller)
    })
  })
}

// DELETE /api/caller/:id
// DESTROY action to delete a single caller:
function destroy(req, res) {
  Caller.remove({_id: req.params.id}, function(err) {
    // return 500 if there's an error:
    if (err) res.status(500).send(err)

    // Otherwise send caller json back with 200 success header:
    res.status(200).send({message: `Caller's information and data successfully deleted!`})
  })
}

module.exports =
{
  index   : index   ,
  create  : create  , // C
  show    : show    , // R
  update  : update  , // U
  destroy : destroy   // D
}
