
/*
crumblyy-backend
tags

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-02 by Saksham
@note Updates :
  Saksham - 2018 05 07 - recent - getByName
*/
const express = require('express');
const auth = require('../middleware/permissions');
const sendErrResp = require('../response/errorResponse');
const tagsHandler = require('../tags/tagsHandler');
const router = express.Router();

// post a new tag
router.post('/', auth.createTags, function(req, resp){
  if (req.user.success === ok) {
    return tagsHandler.post(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get details for a tag
router.get('/:tid', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return tagsHandler.getById(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get list of tags (search by name)
router.get('/', auth.generalAuth, function(req, resp) {
  if (req.user.success === true) {
    return tagsHandler.searchListByName(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// update a tag 
router.put('/:id', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return tagsHandler.put(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// delete a tag
router.delete('/:id', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return tagsHandler.delete(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});


module.exports = router;