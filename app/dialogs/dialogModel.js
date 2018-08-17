
/*
crumblyy-backend
dialogModel

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-06-14 by Saksham
@note Updates :
*/
'use strict';
/*
crumblyy-backend
topicsModel

@author Saksham
@note Last Branch Update -

@note Created on 2018-05-21 by Saksham
@note Updates :
*/
const mongoose = require('mongoose');
const random = require('mongoose-random');

const shortid = require('shortid');
const timeHandler = require('../../utils/timeHandler');
const resObj = require('../response/resObj');
const { Schema } = mongoose;

const DialogSchema = new Schema({
// available
  available: {
    type: Boolean,
    default: false
  },
// created at
  createdAt: String,
// did
  did: {
    type: String,
    unique: true
  },
// details
  details: {
    type: Schema.Types.Mixed,
    required: true
  }
});

// used for saving generated ids
DialogSchema.pre('save', function(next){
  try {
    this.details = JSON.parse(this.details);
    this.createdAt = timeHandler.currentUTC();
    this.did = shortid.generate();
    return next();
  } catch (error) {
    return next(resObj.malformed("Cast to JSON failed for [details]"));
  }
});

// handling errors
DialogSchema.post('save', function(error, doc, next) {
// next resObj.databaseError(error)
  if (error) {
// if json is malformed / any other variable is
    if (error.errors) {
      let message;
      let key = Object.keys(error.errors);
      if (error.message && error.message.includes('uid_1 dup key')) {
        next(resObj.dialogAlreadyExists());
      } else if (error.errors[key[0]].kind === 'required') {
        message = error.errors[key[0]].message.replace("Path", "body param");
        next(resObj.missingBodyParameters(message.replace("`", "[").replace("`", "]")));
      } else {
        key = Object.keys(error.errors);
        ({ message } = error.errors[key[0]]);
        const text = message.substring(0, message.indexOf('value'));
        next(resObj.malformed(text + `[${error.errors[key[0]].path}]`));
      }
    }
    if (error.success === false) {
      return next(error);
//other errors
    } else {
      return next(resObj.databaseError(error));
    }
  }
});

// removing non essential fields from returned document
DialogSchema.post('save', function(doc, next){
  this._doc.__v = undefined;
  return next();
});

/*
-- findOne middlewares -
------------------------
*/

DialogSchema.pre('findOne', next=> next());

DialogSchema.post('findOne', function(doc, next){
  if (doc === null) {
    return next(resObj.dialogNotExist());
  } else {
    doc.__v = undefined;
    return next();
  }
});

DialogSchema.post('findOne', function(error, doc, next){
  if (error) {
    if (error.success === false) {
      return next(error);
    } else {
      return next(resObj.databaseError(error));
    }
  }
});

var DialogRSchema = DialogSchema;
DialogRSchema.plugin(random);

exports.Dialog = mongoose.model('dialogs', DialogSchema);
exports.DialogR = mongoose.model('dialogs', DialogRSchema);
