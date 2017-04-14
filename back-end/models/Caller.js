const
  mongoose  = require(`mongoose`),
  Hotbutton = require(`./Hotbutton`)

// Create Caller Schema:
var callerSchema = new mongoose.Schema({
  name: {type: String, required: true},
  callLog: {type: String, default: ""},
  hotbuttons: [{type: mongoose.Schema.Types.ObjectId, ref: "Hotbutton"}]
})

// Sets Constant For Model:
const Caller = mongoose.model(`Caller`, callerSchema)

// Exports Module:
module.exports = Caller
