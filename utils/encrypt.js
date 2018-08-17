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
const bcrypt = require('bcryptjs');
const resObj = require('../app/response/resObj');
const eCodes = require('./errorCodes');
const Log = require('../app/logger/logging');
const logHandler = require('../app/logger/logHandler');
const C = require('./constants');

/**
 * Use to hash a data (usually password) with bcrypt
 * @param data
 * @param rounds
 * @returns {Promise<any>}
 */
module.exports.hash = (data, rounds) =>
  new Promise(function(resolve, reject) {
    return bcrypt.hash(data, rounds).then(hash => resolve(hash)).catch(function(error) {
//Log.errors.general C.LOG_BCRYPT_ENCRYPT, "#{data} :: #{rounds} :: #{error}"
      if ((error === '') || (error === null) || (error === []) || (error === {}) || !error) {
        error = 'an error occured with hashing library (hashing)';
      }
      reject(resObj.libraryError(eCodes.BCRYPT_HASH_FAILED, error));
      const input = {
        data,
        rounds
      };
      return Log.errors.library(C.BCRYPT, logHandler.dataLogError(C.LOG_BCRYPT_ENCRYPT, input, error));});
  })
;

/**
 * Use to compare the hash with the data with bcrypt
 * @param data
 * @param hash
 * @returns {Promise<any>}
 */
module.exports.compare = (data, hash) =>
  new Promise(function(resolve, reject) {
    return bcrypt.compare(data, hash).then(res => resolve(res)).catch(function(error) {
//Log.errors.general C.LOG_BCRYPT_COMPARE, "#{data} :: #{hash} :: #{error}"
      if ((error === '') || (error === null) || (error === []) || (error === {}) || !error) {
        error = 'an error occured with hashing library (comparing)';
      }
      reject(resObj.libraryError(eCodes.BCRYPT_COMPARE_FAILED, error));
      return Log.errors.library(C.BCRYPT, logHandler.dataLogError(C.LOG_BCRYPT_COMPARE, input, error));});
  })
;
