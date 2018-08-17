
/**
  Create by Saksham on 9th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 26 - recent - general success
  Saksham - 2018 04 27 - recent - general object count
  Saksham - 2018 05 08 - recent - user sign in
  Saksham - 2018 05 15 - recent - file upload
  Saksham - 2018 05 16 - recent - logger
  Saksham - 2018 05 21 - recent - adding body in resp
*/
const sort = require('sort-json');
const Log = require('../logger/logging');
const C = require('../../utils/constants');

/*
------- PRIVATE --------
------------------------
*/

// sorting json alphabetically
const sorting = obj => sort(obj, {ignoreCase: true, reverse: false, depth: 5});

/*
------- PRIVATE --------
------------------------
*/

// user signup
exports.userSignUp = function(req, resp, token, details) {
  delete details.password;
  const body = {
    success: true,
    newUser: true,
    token,
    details: sorting(details)
  };

  resp.status(200).send(body);
  resp.body = body;
  return Log.api.request(req, resp);
};


// user signin
exports.userSignIn = function(req, resp, token, details) {
  delete details.password;
  const body = {
    success: true,
    newUser: false,
    token,
    details: sorting(details)
  };

  resp.status(200).send(body);
  resp.body = body;
  return Log.api.request(req, resp);
};

// general object
exports.generalObject = function(req, resp, details) {
  const body = {
    success: true,
    details: sorting(details)
  };

  resp.status(200).send(body);
  resp.body = body;

  if (req.get(C.UID)) {
    return Log.api.user.request(req, resp);
  } else {
    return Log.api.request(req, resp);
  }
};


// general object count
exports.generalObjectCount = function(req, resp, details) {
  const body = {
    success: true,
    count: details.length,
    details: sorting(details)
  };

  resp.set({
    'X-Per-Page': body.count
  }).status(200).send(body);
  resp.body = body;

  if (req.get(C.UID)) {
    return Log.api.user.request(req, resp);
  } else {
    return Log.api.request(req, resp);
  }
};

// general success
exports.generalSuccess = function(req, resp, message) {
  const body = {
    success: true,
    message
  };
  resp.status(200).send(body);
  resp.body = body;

  if (req.get(C.UID)) {
    return Log.api.user.request(req, resp);
  } else {
    return Log.api.request(req, resp);
  }
};

// file upload
exports.fileUpload = function(req, resp, url) {
  const body = {
    success: true,
    url
  };
  resp.status(200).send(body);
  resp.body = body;

  if (req.get(C.UID)) {
    return Log.api.user.request(req, resp);
  } else {
    return Log.api.request(req, resp);
  }
};