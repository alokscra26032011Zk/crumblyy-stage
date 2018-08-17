/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';
/**
  Create by Saksham on 9th April, 2018
  Last Active Branch - recent
  Updates :
*/
const mongoose = require('mongoose');
const Log = require('../app/logger/logging');
const logHandler = require('../app/logger/logHandler');
const C = require('./constants');

/**
 * Open mongoose connection
 */
module.exports.openConnection = () =>
  new Promise(function(resolve, reject) {
    mongoose.connect(process.env.DB_PATH);
    return mongoose.connection.once('open', () => resolve()).on('error', function(error) {
      reject(error);
      Log.errors.database(logHandler.dataLogError(C.LOG_DB_START, "", error));
      return console.log('Connection error with Mongo DB', error);
  });
  })
;

/**
 * Close mongoose connection
 */
module.exports.closeConnection = () =>
  new Promise(function(resolve, reject) {
    try {
      mongoose.connect(process.env.DB_PATH);
      mongoose.connection.close();
      return resolve();
    } catch (error) {
      return reject(error);
    }
  })
;
