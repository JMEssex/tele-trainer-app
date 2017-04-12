const mongoose = require(`mongoose`);
const debug    = require(`debug`)(`app:models`);

// Set mongoose's promise library to ES2015 Promises:
mongoose.Promise = Promise;

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  name:  {type: String, required: true}
  // createdAt: Date
});

//  Add bcrypt hashing to model (works on a password field):
userSchema.plugin(require(`mongoose-bcrypt`));

// Add a "transformation" to the model's toJson function that
// stops the password field (even in digest format) from being
// returned in any response:
userSchema.options.toJSON = {
  transform: function(document, returnedObject, options) {
    delete returnedObject.password;
    return returnedObject;
  }
};

var User = mongoose.model(`User`, userSchema);

module.exports = User;
