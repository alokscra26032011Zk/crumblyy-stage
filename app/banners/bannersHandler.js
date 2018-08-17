
/*
crumblyy-backend
bannersHandler

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-04-27 by Saksham
@note Updates :
*/
const BannersCtrl = require('./bannersController');
const sendErrResp = require('../response/errorResponse');
const sendSuccResp = require('../response/successResponse');

/*
----- EXPORTS -----
*/

// create banner
exports.post = (req, resp) =>
  BannersCtrl.create(req.body).then(banner=> sendSuccResp.generalObject(req, resp, banner)).catch(error => sendErrResp.normalError(req, resp, error))
;

// get list of banners
exports.getList = (req, resp) =>
  BannersCtrl.getList(req.query.platform, req.query.details).then(details=> sendSuccResp.generalObjectCount(req, resp, details)).catch(error => sendErrResp.normalError(req, resp, error))
;
// get all banners with details
exports.getPopulatedList = (req, resp) =>
  BannersCtrl.getPopulatedList(req.query.platform, req.query.details).then(details=> sendSuccResp.generalObjectCount(req, resp, details)).catch(error => sendErrResp.normalError(req, resp, error))
;
// update a banner
exports.put = (req, resp) =>
BannersCtrl.update(req.params.id, req.body).then(hack=> sendSuccResp.generalObject(req, resp, hack)).catch(error => sendErrResp.normalError(req, resp, error))
;

// delete a banner
exports.delete = (req, resp) =>
BannersCtrl.delete(req.params.id).then(()=> sendSuccResp.generalSuccess(req, resp, "Banner successfully deleted")).catch(error => sendErrResp.normalError(req, resp, error))
;