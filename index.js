
/**
  Create by Saksham on 9th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 18 - recent - changing log object
  Saksham - 2018 04 24 - recent - adding NODE_ENV for logging
*/
require('dotenv').config();
const chalk = require('chalk');
const util = require('util');
const logSymbols = require('log-symbols');
let app = require('./app');
const dbConnection = require('./utils/dbConnection');
const C = require('./utils/constants');

// adding global vars for easy access throughout app
global.ok = true;
global.notok = false;
global.chalk = chalk;
global.log = {
  i(message) {
    if (process.env.NODE_ENV === C.DEV) {
      return console.log(logSymbols.info, chalk.grey(message));
    }
  },
  e(message) {
    if (process.env.NODE_ENV === C.DEV) {
      return console.log(logSymbols.error, chalk.red(message));
    }
  },
  s(message) {
    if (process.env.NODE_ENV === C.DEV) {
      return console.log(logSymbols.success, chalk.green(message));
    }
  },
  w(message){
    if (process.env.NODE_ENV === C.DEV) {
      return console.log(logSymbols.warning, chalk.yellow(message));
    }
  },
  o: {
    i(obj) {
      if (process.env.NODE_ENV === C.DEV) {
        return console.log(logSymbols.info, chalk.grey(util.inspect(obj)));
      }
    },
    e(obj) {
      if (process.env.NODE_ENV === C.DEV) {
        return console.log(logSymbols.error, chalk.red(util.inspect(obj)));
      }
    },
    s(obj) {
      if (process.env.NODE_ENV === C.DEV) {
        return console.log(logSymbols.success, chalk.green(util.inspect(obj)));
      }
    },
    w(obj){
      if (process.env.NODE_ENV === C.DEV) {
        return console.log(logSymbols.warning, chalk.yellow(util.inspect(obj)));
      }
    }
  }
};

// app connection and port addition
app = app.this;
const port = process.env.OS_PORT;

log.i(chalk.yellow('Creating connection to ') + chalk.cyan('MongoDB'));

// creating database connection
dbConnection.openConnection(process.env.DB_PATH).then(function() {
  log.i(chalk.green('Successfully connected to ') + chalk.cyan('MongoDB'));
  app.listen(port);
  log.s(chalk.green('Started actively listening on port ') + chalk.cyan(`${port}`));
  return log.i(`Endpoint is http://localhost:${port}`);

// catch for db connection
}).catch(function(error) {
  log.e(error);
  return process.exit(1);
});

