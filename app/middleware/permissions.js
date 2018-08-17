
/**
  Create by Saksham on 11th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 26 - recent - delete & update content permissions
  Saksham - 2018 04 27 - recent - create banner
  Saksham - 2018 04 27 - recent - content review
  Saksham - 2018 05 02 - recent - tag create
  Saksham - 2018 05 02 - recent - create handler
  Saksham - 2018 05 15 - recent - upload files
  Saksham - 2018 05 21 - recent - create category
  Saksham - 2018 06 14 - recent - create dialog
*/
const userAuth = require('./userAuth');
const C = require('../../utils/constants');
const resObj = require('../response/resObj');

/*
----------- EXPORTS --------------
----------------------------------
*/

// general authentication (self)
exports.generalAuth = (req,resp,next) =>
  userAuth.authorize(req, resp).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
//catch for userAuth.authorize
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// creating end client permission
exports.createEndClient = (req, resp, next) =>
  userAuth.authorize(req, resp, C.CREATE_END_CLIENT).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
//catch for userAuth.authorize
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// creating new hack/content
exports.createContent = (req, resp, next) =>
  userAuth.authorize(req, resp, C.CREATE_CONTENT).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// updating hack/content
exports.updateContent = (req, resp, next) =>
  userAuth.authorize(req, resp, C.UPDATE_CONTENT).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// deleting hack/content
exports.deleteContent = (req, resp, next) =>
  userAuth.authorize(req, resp, C.DELETE_CONTENT).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// creating new banner
exports.createBanner = (req, resp, next) =>
  userAuth.authorize(req, resp, C.CREATE_BANNER).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// content review
exports.contentReview = (req, resp, next) =>
  userAuth.authorize(req, resp, C.CONTENT_REVIEW).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// tags create
exports.createTags = (req, resp, next) =>
  userAuth.authorize(req, resp, C.CREATE_TAGS).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// handler (user) create
exports.createHandler = (req,resp,next) =>
  userAuth.authorize(req, resp, C.CREATE_HANDLER).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// upload files
exports.uploadFiles = (req,resp,next) =>
  userAuth.authorize(req, resp, C.UPLOAD_FILES).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// category create
exports.createCategory = (req,resp,next) =>
  userAuth.authorize(req, resp, C.CREATE_CATEGORY).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// category create
exports.createTopic = (req,resp,next) =>
  userAuth.authorize(req, resp, C.CREATE_TOPIC).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// dialog create
exports.createDialog = (req,resp,next) =>
  userAuth.authorize(req, resp, C.CREATE_DIALOG).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;

// send notification
exports.sendNotification = (req,resp,next) =>
  userAuth.authorize(req, resp, C.SEND_NOTIFICATION).then(function(obj){
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  }).catch(function(obj) {
    [req, resp] = Array.from([obj.req, obj.resp]);
    return next();
  })
;
