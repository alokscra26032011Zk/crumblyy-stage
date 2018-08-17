
/*
crumblyy-backend
contentFlagModel

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-04-27 by Saksham
@note Updates :
*/

const mongoose = require('mongoose');
const timeHandler = require('../../utils/timeHandler');
const resObj = require('../response/resObj');
const { Schema } = mongoose;

const ContentSchema = new Schema({
// created at
  createdAt: String,
// content / hack id
  hid: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
// flagged by
  uid: {
    type: String,
    required: true
  }
});

// storing createdAt timestamp
ContentSchema.pre('save', function(next){
  this.createdAt = timeHandler.currentUTC();
  return next();
});

// handling errors
ContentSchema.post('save', function(error, doc, next) {
//next resObj.databaseError(error)
  if (error) {
// if json is malformed / any other variable is
    if (error.errors) {
      const key = Object.keys(error.errors);
      if (error.errors[key[0]].kind === 'required') {
        const message = error.errors[key[0]].message.replace("Path", "body param");
        return next(resObj.malformed(message.replace("`", "[").replace("`", "]")));
      } else {
        return next(resObj.databaseError(error));
      }
//other errors
    } else {
      return next(resObj.databaseError(error));
    }
  }
});

// removing non essential fields from returned document
ContentSchema.post('save', function(doc, next){
  this._doc.__v = undefined;
  return next();
});


exports.FLAG = mongoose.model('flag-contents', ContentSchema);







