
/*
crumblyy-backend
topics

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-21 by Saksham
@note Updates :
*/
const express = require('express');
const auth = require('../middleware/permissions');
const sendErrResp = require('../response/errorResponse');
const topicsHandler = require('../topics/topicsHandler');
const router = express.Router();

// post a new topic
router.post('/', auth.createTopic, function(req, resp){
  if (req.user.success === true) {
    return topicsHandler.create(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});



// update a topic 
router.put('/:id', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return topicsHandler.put(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// delete a banner
router.delete('/:id', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return topicsHandler.delete(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get a topic
router.get('/:tid', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return topicsHandler.get(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

module.exports = router;