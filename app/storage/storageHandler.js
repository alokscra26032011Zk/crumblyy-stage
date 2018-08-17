
/*
crumblyy-backend
storageHandler

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-15 by Saksham
@note Updates :
  Saksham - 2018 05 17 - recent - Logger
*/
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const shortid = require('shortid');
const request = require('request');
const sendSuccRes = require('../response/successResponse');
const sendErrRes = require('../response/errorResponse');
const resObj = require('../response/resObj');
const C = require('../../utils/constants');
const Log = require('../logger/logging');

//configuring our spaces with aws sdk
aws.config.update({
  secretAccessKey: process.env.SPACES_ACCESS_SECRET,
  accessKeyId: process.env.SPACES_ACCESS_KEY
});

//configuring spaces endpoint
const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT);
const s3 = new aws.S3({endpoint: spacesEndpoint});

/*
------- PRIVATE --------
*/

// upload dp multer
const uploadDp = multer({
  storage: multerS3({
    s3,
    bucket: C.SPACES_USERS_DP,
    key(req, file, cb) {
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
      req.fname = `${shortid.generate()}${ext}`;
      return cb(null, req.fname);
    }
  })}).any();

// upload content image multer
const uploadContent = multer({
  storage: multerS3({
    s3,
    bucket: C.SPACES_CONTENT_IMAGE,
    key(req, file, cb) {
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
      req.fname = `${shortid.generate()}${ext}`;
      return cb(null, req.fname);
    }
  })}).any();

/*
------- EXPORTS --------
*/

// Uploading user dp to spaces
exports.uploadUserDp = (req, resp, next) =>
  uploadDp(req, resp, function(error) {
    if (error) {
      sendErrRes.normalError(resp, resObj.spacesError(error));
      return Log.errors.general(C.LOG_SPACES_DP_UPLOAD, error.toString());
    } else {
      if ((req.files === undefined) || (req.files === [])) {
        return sendErrRes.normalError(req, resp,
          resObj.spacesError("kindly provide file in form-data param [file]")); //**********************
      } else {
        return sendSuccRes.fileUpload(req, resp,
          req.files[0].location.replace(`https://${process.env.SPACES}.${process.env.SPACES_ENDPOINT}`,
            process.env.DOWNLOAD_URL)
        );
      }
    }
  })
;

// Uploading content image to spaces
exports.uploadContentImage = (req, resp, next) =>
  uploadContent(req, resp, function(error) {
    if (error) {
      sendErrRes.normalError(resp, resObj.spacesError(error));
      return Log.errors.general(C.LOG_SPACES_CONTENT_UPLOAD, error.toString());
//Log.errors.general(C.LOG_SPACES_FILE_UPLOAD, logHandler.dataLogError(C.LOG_SPACES_FILE_UPLOAD, null, error))
    } else {
      if ((req.files === undefined) || (req.files === [])) {
        return sendErrRes.normalError(req, resp,
          resObj.spacesError("kindly provide file in form-data param [file]")); //**********************
      } else {
        return sendSuccRes.fileUpload(req, resp,
          req.files[0].location.replace(`https://${process.env.SPACES}.${process.env.SPACES_ENDPOINT}`,
            process.env.DOWNLOAD_URL)
        );
      }
    }
  })
;