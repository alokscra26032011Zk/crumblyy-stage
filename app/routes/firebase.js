
/*
crumblyy-backend
category

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-21 by Saksham
@note Updates :
*/
const express = require('express');
const auth = require('../middleware/permissions');
const sendErrResp = require('../response/errorResponse');
const notifications = require('../firebase/notifications');
const router = express.Router();

// post a new category
router.post('/', auth.sendNotification, function(req, resp){
  if (req.user.success === true) {
    return notifications.sendNotification(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});



module.exports = router;