const mongoose = require(`mongoose`);

const env = require(`./environment`);

// Use different database URIs based on whether an env var exists.
var dbUri = env.MONGODB_URI || `mongodb://localhost/${env.SAFE_TITLE}`;

if (!env.MONGODB_URI) {
  // Check that MongoD is running...
  require(`net`).connect(27017, `localhost`).on(`error`, function() {
    console.log("YOU MUST BOW BEFORE THE MONGOD FIRST, MORTAL!");
    process.exit(0);
  });
}

if (!mongoose.connection._hasOpened) {
  mongoose.connect(dbUri);
}

module.exports = mongoose;
