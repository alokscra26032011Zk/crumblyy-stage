/*
 * decaffeinate suggestions:

/*
crumblyy-backend
categoryHandler

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-21 by Saksham
@note Updates :
*/

/*
------ EXPORTS
*/
const categoryCtrl = require('./categoryController');
const sendSuccResp = require('../response/successResponse');
const sendErrResp = require('../response/errorResponse');

// create category
exports.create = (req, resp) =>
  categoryCtrl.create(req.body).then(category=> sendSuccResp.generalObject(req, resp, category)).catch(error => sendErrResp.normalError(req, resp, error))
;

// get a category
exports.get = (req, resp) =>
  categoryCtrl.get(req.params.cid, req.query.details).then(category=> sendSuccResp.generalObject(req, resp, category)).catch(error => sendErrResp.normalError(req, resp, error))
;

// get a category
exports.getAllCategoryWiseHacks = (req, resp) =>
  categoryCtrl.getAllCategoryWiseHacks(req.query.limit).then(category=> sendSuccResp.generalObject(req, resp, category)).catch(error => sendErrResp.normalError(req, resp, error))
;

// get a category
exports.getCategoryWiseHacks = (req, resp) =>{
   categoryCtrl.getCategoryWiseHacks(req.params.id,req.query.limit).then(category=> sendSuccResp.generalObject(req, resp, category)).catch(error => sendErrResp.normalError(req, resp, error))
}


// update a category
exports.put = (req, resp) =>
categoryCtrl.update(req.params.id, req.body).then(hack=> sendSuccResp.generalObject(req, resp, hack)).catch(error => sendErrResp.normalError(req, resp, error))
;

// delete a category
exports.delete = (req, resp) =>
categoryCtrl.delete(req.params.id).then(()=> sendSuccResp.generalSuccess(req, resp, "Category successfully deleted")).catch(error => sendErrResp.normalError(req, resp, error))
;
