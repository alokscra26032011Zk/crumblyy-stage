
/**
  Create by Saksham on 9th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 11 - recent - adding end-client
  Saksham - 2018 04 24 - recent - get user (self)
  Saksham - 2018 05 03 - recent - create user (handler)
  Saksham - 2018 05 05 - recent - update user (self)
  Saksham - 2018 05 08 - recent - google auth (end-client)
  Saksham - 2018 05 14 - recent - user login
  Saksham - 2018 05 16 - recent - route changes + get users auth methods
  Saksham - 2018 05 24 - recent - auth.post removed from google auth
*/
const express = require('express');
const auth = require('../middleware/permissions');
const sendErrResp = require('../response/errorResponse');
const usersHandler = require('../users/usersHandler');
const router = express.Router();


// post end client
router.post('/signup/end-client', auth.createEndClient, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.postEndClient(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// post a handler
router.post('/signup/handler', auth.createHandler, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.postHandler(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get user (self)
router.get('/', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.getSelf(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// update user (self)
router.put('/', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.updateSelf(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// delete user (self)
router.delete('/', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.deleteSelf(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// post end client (google auth)
router.post('/auth/google', (req, resp)=> usersHandler.postEndClientGoogle(req, resp));

// signin a user
router.post('/auth/email', (req, resp)=> usersHandler.userEmailLogin(req, resp));

// signin a user anonymously
router.post('/auth/anonymous', (req, resp)=> usersHandler.userEmailLoginAnonymously(req, resp));

// available auth methods of a user
router.get('/auth/', (req, resp)=> usersHandler.userAuthMethods(req, resp));

// get user bookmarks
router.get('/bookmarks', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.getBookmarks(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});
// get currently sorted bookmarks
router.get('/bookmarks/all', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.getAllBookmarks(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});
// update bookmark
router.put('/bookmarks', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.updateBookmarks(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});
// update upvotes
router.put('/upvotes', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.updateUpvotes(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});
// update upvotes
router.put('/shares', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.updateShares(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get recommended hacks
router.get('/recommended', auth.generalAuth, function(req, resp){
  if (req.user.success === ok) {
    return usersHandler.getPersonalizedRecommendations(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});
module.exports = router;