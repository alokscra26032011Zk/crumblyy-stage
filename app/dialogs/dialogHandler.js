
/*
crumblyy-backend
dialogHandler

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-06-14 by Saksham
@note Updates :
*/
const dCtrl = require('./dialogController');
const sendSuccResp = require('../response/successResponse');
const sendErrResp = require('../response/errorResponse');

/*
----- exports -----
*/

// create a new dialog
exports.create = (req, resp) =>
  dCtrl.create(req.body).then(details=> sendSuccResp.generalObject(req, resp, details)).catch(error => sendErrResp.normalError(req, resp, error))
;

// get recent dialog
exports.recent = (req, resp) =>
  dCtrl.recent().then(details=> sendSuccResp.generalObject(req, resp, details)).catch(error => sendErrResp.normalError(req, resp, error))
;