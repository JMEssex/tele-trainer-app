const mongoose = require(`mongoose`)

// Create Hotbutton Schema:
const hotbuttonSchema = new mongoose.Schema({
  hotbutton: String
})

// Sets Constant For Model:
const Hotbutton = mongoose.model(`Hotbutton`, hotbuttonSchema)

// Exports Module:
module.exports = Hotbutton
