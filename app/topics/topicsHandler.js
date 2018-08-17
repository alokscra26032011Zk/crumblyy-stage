
/*
crumblyy-backend
topicsHandler

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-21 by Saksham
@note Updates :
*/

/*
------ EXPORTS
*/
const topicsCtrl = require('./topicsController');
const sendSuccResp = require('../response/successResponse');
const sendErrResp = require('../response/errorResponse');

// create category
exports.create = (req, resp) =>
  topicsCtrl.create(req.body).then(category=> sendSuccResp.generalObject(req, resp, category)).catch(error => sendErrResp.normalError(req, resp, error))
;

// get a category
exports.get = (req, resp) =>
  topicsCtrl.get(req.params.tid, req.query.details).then(category=> sendSuccResp.generalObject(req, resp, category)).catch(error => sendErrResp.normalError(req, resp, error))
;

// update a topic
exports.put = (req, resp) =>
topicsCtrl.update(req.params.id, req.body).then(hack=> sendSuccResp.generalObject(req, resp, hack)).catch(error => sendErrResp.normalError(req, resp, error))
;

// delete a topic
exports.delete = (req, resp) =>
topicsCtrl.delete(req.params.id).then(()=> sendSuccResp.generalSuccess(req, resp, "Topic successfully deleted")).catch(error => sendErrResp.normalError(req, resp, error))
;