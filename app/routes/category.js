
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
const categoryHandler = require('../categories/categoryHandler');
const router = express.Router();

// post a new category
router.post('/', auth.createCategory, function(req, resp){
  if (req.user.success === true) {
    return categoryHandler.create(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get a category
router.get('/:cid', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return categoryHandler.get(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get all hacks from all categories 
router.get('/list/all', auth.generalAuth, function(req, resp){
  if (req.user.success === true) { 
    return categoryHandler.getAllCategoryWiseHacks(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get categorywise hacks 
router.get('/list/all/:id', auth.generalAuth, function(req, resp){
  if (req.user.success === true) { 
    return categoryHandler.getCategoryWiseHacks(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// update a category 
router.put('/:id', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return categoryHandler.put(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// // delete a category
// router.delete('/:id', auth.generalAuth, function(req, resp){
//   if (req.user.success === true) {
//     return categoryHandler.delete(req, resp);
//   } else {
//     return sendErrResp.normalError(req, resp, req.user);
//   }
// });

module.exports = router;