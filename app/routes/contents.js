
/*
crumblyy-backend
contents

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-04-17 by Saksham
@note Updates :
  Saksham - 2018 04 26 - recent - adding get/update/delete routes
  Saksham - 2018 04 27 - recent - content review
  Saksham - 2018 04 27 - recent - flag hack
  Saksham - 2018 05 07 - recent - findContentWithTagId
  Saksham - 2018 05 07 - recent - content search
  Saksham - 2018 05 10 - recent - get list of content filtered by category
  Saksham - 2018 05 11 - recent - get list of content sorted by date + after an hid
*/
const express = require('express');
const auth = require('../middleware/permissions');
const sendErrResp = require('../response/errorResponse');
const contentHandler = require('../content/contentHandler');
const router = express.Router();

// post new hack/content
router.post('/', auth.createContent, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.post(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get a hack/content
router.get('/:hid', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.get(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// update a hack/content
router.put('/:hid', auth.updateContent, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.put(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// delete a hack/content
router.delete('/:hid', auth.deleteContent, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.delete(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// flag a hack
router.put('/:hid/flag', auth.generalAuth, function(req, resp) {
  if (req.user.success === true) {
    return contentHandler.flagHack(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// review content / hacks list
router.get('/handler/review', auth.contentReview, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.getReviewList(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// findContentWithTagId
router.get('/tags/list', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.findContentWithTagId(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// similar hacks
router.get('/similar/list', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.similarHacks(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});
// trending hacks
router.get('/trending/list', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.trendingHacks(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});
// search content
router.get('/search/list', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.contentSearch(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// search content
router.get('/search/list/all', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.contentSearchAll(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// random hacks
router.get('/random/list', auth.generalAuth, function(req, resp){
  if (req.user.success === true) {
    return contentHandler.randomHacks(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get list of content filtered by category
router.get('/category/list', auth.generalAuth, function(req, resp) {
  if (req.user.success === true) {
    return contentHandler.getListByCategory(req, resp);
  } else {
    return sendErrResp.normalError(req, resp, req.user);
  }
});

// get list of content sorted by date
router.post('/get-content', auth.generalAuth, function(req, res) {
  if (req.user.success === true) {
    let obj = {
      fulfillmentText: "This is a text response",
      fulfillmentMessages: [
        {
          card: {
            title: "card title",
            subtitle: "card text",
            imageUri: "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
            buttons: [
              {
                text: "button text",
                postback: "https://assistant.google.com/"
              }
            ]
          }
        }
      ]
    }
    return res.send(JSON.parse(JSON.stringify(obj)))
  }
});

module.exports = router;
