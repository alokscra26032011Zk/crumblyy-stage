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
    Saksham - 2018 06 22 - recent - using esat
*/
const esat = require('esat');
const resObj = require('../app/response/resObj');
const errorCode = require('./errorCodes');
const key = process.env.ESAT_ENCRYPTION_KEY;
const iss = process.env.ISSUER;

/*
----- exports -----
*/

// generate token for end-clients
exports.generateC = uid =>
  new Promise(function(resolve){
    const options = {
      exp: 365 * 24 * 60 * 60 * 1000,
      rat: 365 * 24 * 60 * 60 * 1000,
      iss,
      payload: {
        uid
      }
    };

    return esat.generate(options, key).then(obj=> resolve(obj.token));
  })
;

// generate token for other users (moderators/admin etc.)
exports.generateA = uid =>
  new Promise(function(resolve){
    const options = {
      exp: 7 * 24 * 60 * 60 * 1000,
      rat: 7 * 24 * 60 * 60 * 1000,
      iss,
      payload: {
        uid
      }
    };

    return esat.generate(options, key).then(obj=> resolve(obj.token));
  })
;

// verify token
exports.verify = token =>
  new Promise(function(resolve, reject) {
    return esat.verify(token, key).then(obj=> resolve(obj)).catch(error => reject(errorHandling(error)));
  })
;

// refresh token
exports.refresh = token =>
  new Promise(function(resolve, reject){
    return esat.refresh(token, key).then(token=> resolve(token)).catch(error => reject(errorHandling(error)));
  })
;

/*
----- private -----
*/
var errorHandling = function(error) {
  if (error.code === 1) {
    return resObj.tokenError(error.message, errorCode.TOKEN_INVALID_KEY);
  } else if (error.code === 2) {
    return resObj.tokenError(error.message, errorCode.TOKEN_MALFORMED);
  } else if (error.code === 3) {
    return resObj.tokenError(error.message, errorCode.TOKEN_EXPIRED);
  }
};