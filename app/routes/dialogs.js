
/*
crumblyy-backend
dialogs

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-06-14 by Saksham
@note Updates :
*/
const express = require('express');
const auth = require('../middleware/permissions');
const dialogHandler = require('../dialogs/dialogHandler');
const sendErrResp = require('../response/errorResponse');
const router = express.Router();

// create dialog
router.post('/', auth.createDialog, function(req, resp, next){
  if (req.user.success === true) {
    return dialogHandler.create(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// read recent dialog
router.get('/list/recent', auth.generalAuth, function(req, resp, next){
  if (req.user.success === true) {
    return dialogHandler.recent(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

module.exports = router;