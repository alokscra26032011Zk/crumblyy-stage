
/*
crumblyy-backend
categoryModel

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


const CategorySchema = new Schema({
// available
  available: {
    type: Boolean,
    default: false
  },
// cid
  cid: {
    type: String,
    unique: true
  },
// created at
  createdAt: String,
// image
  image: {
    type: String,
    default: null
  },
// name
  name: {
    type: String,
    required: true
  },
// updated at
  updatedAt: String
});

// used for saving generated ids
CategorySchema.pre('save', function(next){
  this.createdAt = timeHandler.currentUTC();
  this.updatedAt = timeHandler.currentUTC();
  this.cid = shortid.generate();
  return next();
});

// handling errors
CategorySchema.post('save', function(error, doc, next) {
//next resObj.databaseError(error)
  if (error) {
// if json is malformed / any other variable is
    if (error.errors) {
      let message;
      let key = Object.keys(error.errors);
      if (error.errors[key[0]].kind === 'required') {
        message = error.errors[key[0]].message.replace("Path", "body param");
        return next(resObj.missingBodyParameters(message.replace("`", "[").replace("`", "]")));
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
CategorySchema.post('save', function(doc, next){
  this._doc.__v = undefined;
  return next();
});

/*
-- findOne middlewares -
------------------------
*/

CategorySchema.pre('findOne', next=> next());

CategorySchema.post('findOne', function(doc, next){
  if (doc === null) {
    return next(resObj.categoryNotExist());
  } else {
    doc.__v = undefined;
    return next();
  }
});

CategorySchema.post('findOne', function(error, doc, next){
  if (error) {
    if (error.success === false) {
      return next(error);
    } else {
      return next(resObj.databaseError(error));
    }
  }
});

CategoryRSchema = CategorySchema;
CategoryRSchema.plugin(random);
exports.Category = mongoose.model('category', CategorySchema);
exports.CategoryR = mongoose.model('category', CategoryRSchema);