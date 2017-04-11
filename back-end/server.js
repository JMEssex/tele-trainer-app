const
  express    = require(`express`)            ,
  app        = express()                     ,
  logger     = require(`morgan`)             ,
  bodyParser = require(`body-parser`)        ,
  routes     = require(`./config/routes.js`) ,
  port       = process.env.PORT || 3000

// Load env variable from .env file:
require('dotenv').config()

// Establish connection to mongo database:
const mongoose = require(`./config/database.js`);

// Log requests made to the app:
app.use(logger(`dev`))

// Make json objects available in requests:
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Mount routes at /api:
app.use(`/api`, routes)

// Run the web server:
app.listen(port, function() {
  var msg = msg = `Server listening on port: ${port}.`
  var bracket = `=`.repeat(msg.length+4)
  console.log(`${bracket}\n| ${msg} |\n${bracket}`)
})
