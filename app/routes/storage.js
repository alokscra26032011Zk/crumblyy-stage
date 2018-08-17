
/*
crumblyy-backend
storage

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-15 by Saksham
@note Updates :
*/
const express = require('express');
const auth = require('../middleware/permissions');
const storage = require('../storage/storageHandler');
const sendErrResp = require('../response/errorResponse');
const router = express.Router();

// upload dp to spaces
router.post('/dp', auth.generalAuth, function(req, resp, next){
  if (req.user.success === true) {
    return storage.uploadUserDp(req, resp, next);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// upload content image to spaces
router.post('/content', auth.generalAuth, function(req, resp, next){
  if (req.user.success === true) {
    return storage.uploadContentImage(req, resp, next);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

module.exports = router;