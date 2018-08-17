
/*
crumblyy-backend
contentHandler

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-04-17 by Saksham
@note Updates :
  Saksham - 2018 04 26 - recent - update hack
  Saksham - 2018 04 27 - recent - get list of hacks to review
  Saksham - 2018 04 27 - recent - create flag hack entry
  Saksham - 2018 05 07 - recent - findContentWithTagId (fixed delete function)
  Saksham - 2018 05 07 - recent - content search
  Saksham - 2018 05 09 - recent - pagination in content search
  Saksham - 2018 05 10 - recent - get list of content grouped by category
  Saksham - 2018 05 11 - recent - get list of content sorted by date + after an hid
*/
const contentCtrl = require('./contentController');
const utils = require('../../utils/utitlities');
const resObj = require('../response/resObj');
const sendSuccResp = require('../response/successResponse');
const sendErrResp = require('../response/errorResponse');

/*
------ PRIVATE ------
---------------------
*/

/*
------ EXPORTS ------
---------------------
*/

// create a new hack
exports.post = (req, resp) =>
  contentCtrl.create(req.body).then(hack=> sendSuccResp.generalObject(req, resp, hack)).catch(error=> sendErrResp.normalError(req, resp, error))
;

// fetch a hack
exports.get = (req, resp) =>
  contentCtrl.get(req.params.hid).then(hack=> sendSuccResp.generalObject(req, resp, hack)).catch(error=> sendErrResp.normalError(req, resp, error))
;

// update a hack
exports.put = (req, resp) =>
  contentCtrl.update(req.params.hid, req.body).then(hack=> sendSuccResp.generalObject(req, resp, hack)).catch(error => sendErrResp.normalError(req, resp, error))
;

// delete a hack
exports.delete = (req, resp) =>
  contentCtrl.delete(req.params.hid).then(()=> sendSuccResp.generalSuccess(req, resp, "Content successfully deleted")).catch(error => sendErrResp.normalError(req, resp, error))
;

// get list of hacks to review
exports.getReviewList = (req, resp) =>
  contentCtrl.getReviewList(req.query.details).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error))
;

// create a flag hack entry
exports.flagHack = (req, resp) =>
  contentCtrl.createFlag(req.body).then(details=> sendSuccResp.generalObject(req, resp, details)).catch(error => sendErrResp.normalError(req, resp, error))
;

// get list of content with tag
exports.findContentWithTagId = (req, resp) =>
  contentCtrl.findContentWithTagId(req.query.tid,req.query.offset, req.query.limit, req.query.details).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error))
;

// find content with tag Id
exports.contentSearch = (req, resp) =>
  contentCtrl.contentSearch(req.query.search, req.query.offset, req.query.limit, req.query.details).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error))
;

// find content with tag Id
exports.contentSearchAll = (req, resp) =>
  contentCtrl.contentSearchAll(req.query.search, req.query.offset, req.query.limit, req.query.details).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error))
;

// find random hacks
exports.randomHacks = (req, resp) =>{
  contentCtrl.randomHacks(req.query)
  .then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks))
  .catch(error => sendErrResp.normalError(req, resp, error))
  }

// get list of similar hacks
exports.similarHacks = (req, resp) =>
  contentCtrl.similarHacks(req.query.tid,req.query.cid,req.query.hid,req.query.offset, req.query.limit, req.query.details).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error))
;
// get list of trending hacks
exports.trendingHacks = (req, resp) =>
  contentCtrl.trendingHacks(req.query.tid,req.query.cid,req.query.hid,req.query.offset, req.query.limit, req.query.details).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error))
;
// get list of content grouped by category
exports.getListByCategory = function(req, resp) {
  
  if (req.query.id) {
    return contentCtrl.getListByCategoryAfterId(req.query.id, req.query.cid, req.query.offset, req.query.limit, req.query.sort, req.query.details).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error));
  } else {
    return contentCtrl.getListByCategory(req.query.cid, req.query.offset, req.query.limit, req.query.sort, req.query.details).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error));
  }
};

// get list of content sorted by date
exports.getListSortedByDate = function(req, resp) {
  if (req.query.id) {  
    return contentCtrl.getListAfterId(req.query).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error));
  } else {
    return contentCtrl.getListSortedByDate(req.query.offset, req.query.limit, req.query.sort, req.query.details).then(hacks=> sendSuccResp.generalObjectCount(req, resp, hacks)).catch(error => sendErrResp.normalError(req, resp, error));
  }
};