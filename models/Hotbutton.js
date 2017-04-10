const mongoose = require(`mongoose`)

// Create Hotbutton Schema:
const hotbuttonSchema = new mongoose.Schema({
    hotbutton: String
  })

//
const Hotbutton = mongoose.model(`hotbutton`, hotbuttonSchema)

module.exports = Hotbutton
