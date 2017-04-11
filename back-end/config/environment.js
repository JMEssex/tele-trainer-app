var _ = require(`lodash`);

var localEnvVars = {
  TITLE:      `Tele Trainer`,
  SAFE_TITLE: `tele-trainer`,
  SECRET_KEY: `teletrainerismybabyandiwillfighttothedeath`
};

// Merge all enviroment variables into one object.
module.exports = _.extend(process.env, localEnvVars);
