
/*
crumblyy-backend
tagsCtrl

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-02 by Saksham
@note Updates :
  Saksham - 2018 05 07 - recent - getByName
  Saksham - 2018 05 09 - recent - get list of tags (search on name)
*/
const tagsCtrl = require('./tagsController');
const sendSuccResp = require('../response/successResponse');
const sendErrResp = require('../response/errorResponse');

/*
-------- PRIVATE --------
*/

/*
-------- EXPORTS --------
*/
// post a tag
exports.post = (req, resp) =>
  tagsCtrl.create(req.body).then(tag => sendSuccResp.generalObject(req, resp, tag)).catch(error => sendErrResp.normalError(req, resp, error))
  ;

// get a tag by id
exports.getById = (req, resp) =>
  tagsCtrl.getById(req.params.tid, req.query.details).then(tag => sendSuccResp.generalObject(req, resp, tag)).catch(error => sendErrResp.normalError(req, resp, error))
  ;

// get list of tags (search on name)
exports.searchListByName = (req, resp) =>
  tagsCtrl.searchListByName(req.query.search, req.query.offset, req.query.limit, req.query.details).then(tags => sendSuccResp.generalObjectCount(req, resp, tags)).catch(error => sendErrResp.normalError(req, resp, error))
  ;

// update a tag
exports.put = (req, resp) =>
  tagsCtrl.update(req.params.id, req.body).then(hack => sendSuccResp.generalObject(req, resp, hack)).catch(error => sendErrResp.normalError(req, resp, error))
  ;

// delete a tag
exports.delete = (req, resp) =>
  tagsCtrl.delete(req.params.id).then(() => sendSuccResp.generalSuccess(req, resp, "Tags successfully deleted")).catch(error => sendErrResp.normalError(req, resp, error))
  ;