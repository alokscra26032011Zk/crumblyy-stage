
/**
  Create by Saksham on 11th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 05 16 - recent - logger
*/
const Log = require('../logger/logging');
const C = require('../../utils/constants');

// Sending normal JSON error
module.exports.normalError = function(req, resp, error) {
  log.i(error)
  const { statusCode } = error;
  delete error.statusCode;
  resp.body = error;
  resp.status(statusCode).json(error);

  if (req.get(C.UID)) {
    return Log.api.user.request(req,resp);
  } else {
    return Log.api.request(req,resp);
  }
};