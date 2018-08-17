
/*
crumblyy-backend
tagsModel

@author Saksham
@note Last Branch Update - recent
    
@note Created on 2018-05-02 by Saksham
@note Updates :
*/
const mongoose = require('mongoose');
const random = require('mongoose-random');

const timeHandler = require('../../utils/timeHandler');
const resObj = require('../response/resObj');
const shortid = require('shortid');
const { Schema } = mongoose;

const TagsSchema = new Schema({
//created at
  createdAt: String,
// name of the tag
  name: {
    type: String,
    required: true
  },
// tag unique id
  tid: {
    type: String,
    unique: true
  },
// updated at
  updatedAt: String
});

//used for saving generated ids
TagsSchema.pre('save', function(next){
  this.tid = shortid.generate();
  this.createdAt = timeHandler.currentUTC();
  this.updatedAt = timeHandler.currentUTC();
  return next();
});

// handling errors
TagsSchema.post('save', function(error, doc, next) {
//next resObj.databaseError(error)
  if (error) {
//duplicate tid
    if (error.message && error.message.includes('tid_1 dup key')) {
      return next(resObj.tagAlreadyExists());
// if json is malformed / any other variable is
    } else if (error.errors) {
      let message;
      let key = Object.keys(error.errors);
      if (error.errors[key[0]].kind === 'required') {
        message = error.errors[key[0]].message.replace("Path", "body param");
        return next(resObj.malformed(message.replace("`", "[").replace("`", "]")));
      } else {
        key = Object.keys(error.errors);
        ({ message } = error.errors[key[0]]);
        const text = message.substring(0, message.indexOf('value'));
        return next(resObj.malformed(text + `[${error.errors[key[0]].path}]`));
      }
//other errors
    } else {
      return next(resObj.databaseError(error));
    }
  }
});

// removing non essential fields from returned document
TagsSchema.post('save', function(doc, next){
  this._doc.__v = undefined;
  return next();
});

/*
-- findOne middlewares -
------------------------
*/

TagsSchema.pre('findOne', next=> next());

TagsSchema.post('findOne', function(doc, next){
  if (doc === null) {
    return next(resObj.tagNotExist());
  } else {
    doc.__v = undefined;
    return next();
  }
});

TagsSchema.post('findOne', function(error, doc, next){
  if (error) {
    if (error.success === false) {
      return next(error);
    } else {
      return next(resObj.databaseError(error));
    }
  }
});

TagsRSchema = TagsSchema;
TagsRSchema.plugin(random);
exports.Tags = mongoose.model('tags', TagsSchema);
exports.TagsR = mongoose.model('tags', TagsRSchema);
