const
  express    = require(`express`)            ,
  app        = express()                     ,
  logger     = require(`morgan`)             ,
  bodyParser = require(`body-parser`)        ,
  routes     = require(`./config/routes.js`) ,

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
