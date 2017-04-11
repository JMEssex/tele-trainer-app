#!/usr/bin/env node

const
  http  = require(`http`),
  debug = require(`debug`)(`app:http`);

const
  env   = require(`../config/enviroment`),
  app   = require(`../server`);

// Get port from environment and store:
const port = normalizePort(process.env.PORT || `3000`);
app.set(`port`, port);

// Create HTTP server:
const server = http.createServer(app);

// Listen on provided port, on all network interfaces:
server.listen(port);
server.on(`error`, onError);
server.on(`listening`, onListening);


///// HELPER FUNCTIONS USED ABOVE /////

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >=0) return port;
  return false;
}

function onError(err) {
  if (err.syscall !== `listen`) throw err;

  var bind = (typeof port === `string`)
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (err.code) {
    case `EACCES`:
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case `EADDRINUSE`:
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
}

function onListening() {
  var addr = server.address();
  var bind = (typeof addr === `string`)
    ? `pipe: ${addr}`
    : `port: ${addr.port}`;
  var msg = `Server listening on ${bind}.`
  var bracket = `=`.repeat(msg.length+4)
  console.log(`${bracket}\n| ${msg} |\n${bracket}`)
}
