
/*
crumblyy-backend
general

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-04-18 by Saksham
@note Updates :
  Saksham - 2018 04 23 - recent - unwanted error handling & timer
  Saksham - 2018 05 17 - recent - logger
  Alok    - 2018 06 28 - recent - timeout
*/
const resObj = require('../response/resObj');
const sendErrResp = require('../response/errorResponse');
const Log = require('../logger/logging');
const logHandler = require('../logger/logHandler');
const C = require('../../utils/constants');
const onHeaders = require('on-headers');

// general request logging
exports.reqLog = function(req, resp, next) {
  log.i(`${req.method} ${req.originalUrl} [Incoming Request]`);
  resp.set({
    'X-Powered-By' : 'Stack v1.0'
  });
  const start = Date.now();
  onHeaders(resp, function() {
    const duration = Date.now() - start;
    if (resp.statusCode === 200) {
      return log.i(`${req.method} ${req.originalUrl} [${chalk.green(resp.statusCode)}] :: ${duration} ms`);
    } else if (Array.from(__range__(400, 499, true)).includes(resp.statusCode)) {
      return log.i(`${req.method} ${req.originalUrl} [${chalk.yellow(resp.statusCode)}] :: ${duration} ms`);
    } else if (Array.from(__range__(500, 599, true)).includes(resp.statusCode)) {
      return log.i(`${req.method} ${req.originalUrl} [${chalk.red(resp.statusCode)}] :: ${duration} ms`);
    }
  });
  return next();
};

// handle unwanted errors
exports.error = function(err, req, resp, next) {
  log.e(err);
  Log.errors.general(C.LOG_EXPRESS_UNHANDLED_ERROR, err.toString());
  if (resp.headerSent === false) {
    sendErrResp.normalError(req, resp, resObj.databaseError(err));
  }
  return next();
};

  // request timeout
exports.timeout = function(req, resp, next) {
  resp.setTimeout(10000, function() {
    if (!req.originalUrl.indexOf("v2/files") > -1) {
      return sendErrResp.normalError(req, resp, resObj.timeout());
    }
  });
  return next();
};
function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}