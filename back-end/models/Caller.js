const
  mongoose  = require(`mongoose`),
  Hotbutton = require(`./Hotbutton`)

// Create Caller Schema:
const callerSchema = new mongoose.Schema({
  name: String,
  callLog: String,
  hotbuttons: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hotbutton'}]
})

// Sets Constant For Model:
const Caller = mongoose.model(`Caller`, callerSchema)

// Exports Module:
module.exports = Caller