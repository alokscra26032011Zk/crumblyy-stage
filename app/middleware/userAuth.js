
/**
  Create by Saksham on 10th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 11 - recent - auth exports function, minor changes
  Saksham - 2018 05 17 - recent - logger
*/
const userCtrl = require('../users/usersController');
const resObj = require('../response/resObj');
const C = require('../../utils/constants');
const tokenHandler = require('../../utils/tokenHandler');
const timeHandler = require('../../utils/timeHandler');
const Log = require('../logger/logging');

/*
----------- PRIVATE --------------
----------------------------------
*/

//# checking a user's permissions from DATABASE
const userPermission = (uid, permission) =>
  new Promise(function(resolve, reject) {
    return userCtrl.userPermissions(uid).then(function(user) {
//access denied
      if (user.permissions.indexOf(C.ACCESS_DENIED) > -1) {
        reject(resObj.completeAccessDenied('complete access is denied on this platform, (contact moderator/admin)'));
        return Log.errors.general(C.LOG_ACCESS_DENIED, `${uid}`);
//permission not found
      } else if (user.permissions.indexOf(permission) === -1) {
        return reject(resObj.accessDenied(`not authorized for [${permission}], (contact moderator/admin)`));
//permission is available to user
      } else {
        return resolve(user.permissions);
      }
// catch for fetching userPermissions
    }).catch(error => reject(error));
  })
;

// resolve/reject obj for verifyTokenAndPermission
// @param _ : is either resolve/reject accordingly
const resolveObj = function(_, req, resp, permissions, error) {
  const obj = {
    req,
    resp
  };

  if (permissions !== null) {
    obj.req.user = {
      success: ok,
      permissions
    };
  } else {
    obj.req.user = error;
  }

  return _(obj);
};

//# verify token and privilege
const verifyTokenAndPermission = function(req, resp, permission) {
  if (permission == null) { permission = C.SELF; }
  return new Promise(function(resolve, reject){
    const token = req.get(C.X_API_KEY);
    if (token) {
//verify token
      return tokenHandler.verify(token).then(function(decoded){
        console.log('Decode-uid',decoded.payload.uid);
        req.headers[C.UID] = decoded.payload.uid;
        resp.set(C.EXPIRES, timeHandler.formatTimeForHeaders(decoded.exp));
        return userPermission(decoded.payload.uid, permission).then(permissions=> resolveObj(resolve, req, resp, permissions)).catch(error => resolveObj(reject, req, resp, null, error));
//catch for token verify error
      }).catch(error1 => resolveObj(reject, req, resp, null, error1));
//else for if token provided
    } else {
      return resolveObj(reject, req, resp, null, resObj.missingHeaders(`kindly provide [${C.X_API_KEY}] in headers`));
    }
  });
};


/*
----------- EXPORTS --------------
----------------------------------
*/

// verify basic user access (SELF) & token
exports.verifyAccess = (req, resp, next) =>
  verifyTokenAndPermission(req, resp).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// verify access & token
exports.authorize = (req, resp, permission) =>
  new Promise(function(resolve, reject){
    return verifyTokenAndPermission(req, resp, permission).then(obj=> resolve(obj)).catch(obj=> reject(obj));
  })
;