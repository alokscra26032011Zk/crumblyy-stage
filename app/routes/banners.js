
/*
crumblyy-backend
banners

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-04-27 by Saksham
@note Updates :
*/
const express = require('express');
const auth = require('../middleware/permissions');
const sendErrResp = require('../response/errorResponse');
const bannersHandler = require('../banners/bannersHandler');
const router = express.Router();

// post a new banner
router.post('/', auth.createBanner, function(req, resp){
  if (req.user.success === true) {
    return bannersHandler.post(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get list of banners
router.get('/', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return bannersHandler.getList(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});
// get all banners with details
router.get('/all', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return bannersHandler.getPopulatedList(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// update a banner 
router.put('/:id', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return bannersHandler.put(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// delete a banner
router.delete('/:id', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return bannersHandler.delete(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

module.exports = router;