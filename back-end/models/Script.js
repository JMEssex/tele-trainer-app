const
  mongoose = require(`mongoose`),
  Caller   = require(`./Caller`)

// Create Script Schema:
const scriptSchema = new mongoose.Schema({
  question: String
})

// Sets Constant For Model:
const Script = mongoose.model(`Script`, scriptSchema)

// Exports Module:
module.exports = Script
