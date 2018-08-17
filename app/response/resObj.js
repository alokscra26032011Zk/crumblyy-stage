
/**
  Create by Saksham on 9th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 13 - recent - notFound
  Saksham - 2018 05 02 - recent - tag already exist
  Saksham - 2018 05 08 - recent - google auth error
  Saksham - 2018 05 14 - recent - user misc errors
  Saksham - 2018 05 15 - recent - spaces error
  Saksham - 2018 05 21 - recent - category doesn't exist
  Saksham - 2018 05 22 - recent - _id exists
  Saksham - 2018 06 14 - recent - dialog not exists
  Alok    - 2018 06 28 - recent - complete access denied
*/

const eCodes = require('../../utils/errorCodes');
const eTypes = require('../../utils/errorTypes');

// response error object
const resErrorObject = (errorCode, errorType, errorMessage, statusCode) =>
  ({
    success: false,
    errorCode,
    errorType,
    errorMessage,
    errorDetails: eCodes.LINK + "#" + errorCode,
    statusCode
  })
;

//--------------------------------
//--------------------------------

// not found route
exports.notFound = (method, originalUrl) =>
  resErrorObject(eCodes.NOT_FOUND, eTypes.USER_ERROR,
    `Given route is not found - [${method}] ` + originalUrl, 404)
;

// third party library error (500)
exports.libraryError = (code, message) => resErrorObject(code, eTypes.INTERNAL_SERVER_ERROR, message, 500);


// error in a user provided token (401)
exports.tokenError = function(message, code) {
  if (code === 604) {
    return resErrorObject(code, eTypes.TOKEN_ERROR, message, 500);
  } else {
    return resErrorObject(code, eTypes.TOKEN_ERROR, message, 401);
  }
};

// user doesn't exist (400)
exports.userNotExist = () =>
  resErrorObject(eCodes.USER_NOT_EXIST, eTypes.USER_ERROR,
    "User doesn't exist", 400)
;

// user already exists
exports.userAlreadyExists = message =>
  resErrorObject(eCodes.USER_ALREADY_EXISTS, eTypes.USER_ERROR,
    `User already exists - ${message}`, 400)
;

// incorrect access level (401) / access denied (403)
exports.accessDenied = function(message) {
  const msg = message || '';
  return resErrorObject(eCodes.ACCESS_DENIED, eTypes.USER_ERROR,
    `ACCESS DENIED - ${msg}`, 403);
};

//complete access denied
exports.completeAccessDenied = () =>
  resErrorObject(eCodes.COMPLETE_ACCESS_DENIED, eTypes.USER_ERROR,
    'COMPLETE ACCESS DENIED on this platform, (contact moderator/admin)', 405)
;

// database error
exports.databaseError = function(error) {
  if ((error === '') || (error === null) || (error === []) || (error === {}) || !error) {
    error = 'an error occured while fulfilling database request';
  }

  return resErrorObject(eCodes.DATABASE_ERROR, eTypes.INTERNAL_SERVER_ERROR,
    error, 500);
};

// missing header fields (400)
exports.missingHeaders = message =>
  resErrorObject(eCodes.HEADER_NOT_PROVIDED, eTypes.MISSING_DATA,
    message, 400)
;

// missing Body Parameters (400)
exports.missingBodyParameters = message =>
  resErrorObject(eCodes.BODY_PARAMETER_NOT_PROVIDED,
    eTypes.MISSING_DATA, message, 400)
;

// missing Query Parameter (400)
exports.missingQueryParameters = message =>
  resErrorObject(eCodes.QUERY_PARAMETER_NOT_PROVIDED, eTypes.MISSING_DATA,
    message, 400)
;

// hack already exists (500)
exports.hackAlreadyExists = () =>
  resErrorObject(eCodes.HACK_ALREADY_EXISTS, eTypes.INTERNAL_SERVER_ERROR,
    'Hack-ID already exists', 400)
;

// tag already exists (500)
exports.tagAlreadyExists = () =>
  resErrorObject(eCodes.TAG_ALREADY_EXISTS, eTypes.INTERNAL_SERVER_ERROR,
    'Hack-ID already exists', 500)
;

// hack doesn't exist (400)
exports.hackNotExist = () =>
  resErrorObject(eCodes.HACK_NOT_EXISTS, eTypes.USER_ERROR,
    "Hack doesn't exist", 400)
;

// tag doesn't exist (400)
exports.tagNotExist = () =>
  resErrorObject(eCodes.TAG_NOT_EXISTS, eTypes.USER_ERROR,
    "Tag doesn't exist", 400)
;

// data type malformed
exports.malformed = message => resErrorObject(eCodes.MALFORMED, eTypes.USER_ERROR, message, 400);

// google authentication error
exports.googleAuthError = (code, error) => resErrorObject(code, eTypes.USER_ERROR, error, 400);

// user misc. error
exports.userError = message => resErrorObject(eCodes.USER_MISC_ERRORS, eTypes.USER_ERROR, message, 400);

// spaces error (500)
exports.spacesError = message => resErrorObject(eCodes.SPACES_ERROR, eTypes.SERVER_EXTERNAL_ERROR, message, 500);

// category doesn't exist (400)
exports.categoryNotExist = () =>
  resErrorObject(eCodes.CATEGORY_NOT_EXIST, eTypes.USER_ERROR,
    "Category doesn't exist", 400)
;

// topic doesn't exist (400)
exports.topicNotExist = () =>
  resErrorObject(eCodes.TOPIC_NOT_EXIST, eTypes.USER_ERROR,
    "Topic doesn't exist", 400)
;

// _id exists
exports.idAlreadyExists = () =>
  resErrorObject(eCodes.ID_ALREADY_EXISTS, eTypes.USER_ERROR,
    "_id already exists", 400)
;

// dialog doesn't exist (400)
exports.dialogNotExist = () =>
  resErrorObject(eCodes.DIALOG_NOT_EXIST, eTypes.USER_ERROR,
    "Dialog doesn't exist", 400)
;

// dialog exists
exports.dialogAlreadyExists = () =>
  resErrorObject(eCodes.DIALOG_ALREADY_EXIST, eTypes.USER_ERROR,
    "did already exists", 400)
;

// banner doesn't exist (400)
exports.bannerNotExist = () =>
  resErrorObject(eCodes.BANNER_NOT_EXIST, eTypes.USER_ERROR,
    "Banner doesn't exist", 400)
;

// request time out (408)
exports.timeout = () => resErrorObject(408, eTypes.INTERNAL_SERVER_ERROR, 'request timed out', 408);