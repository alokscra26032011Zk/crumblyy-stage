
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

const TopicSchema = new Schema({
// available
  available: {
    type: Boolean,
    default: false
  },
// tid
  tid: {
    type: String,
    unique: true
  },
// category
  category: {
    type: {
      cid: String,
      name: String
    },
    required: true
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
TopicSchema.pre('save', function(next){
  try {
    this.category = JSON.parse(this.category);

    this.createdAt = timeHandler.currentUTC();
    this.updatedAt = timeHandler.currentUTC();
    this.tid = shortid.generate();
    return next();
  } catch (error) {
    return next(resObj.malformed("Cast to JSON failed for [category]"));
  }
});

// handling errors
TopicSchema.post('save', function(error, doc, next) {
//next resObj.databaseError(error)
  if (error) {
// if json is malformed / any other variable is
    if (error.errors) {
      let message;
      let key = Object.keys(error.errors);
      if (error.errors[key[0]].kind === 'required') {
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
TopicSchema.post('save', function(doc, next){
  this._doc.__v = undefined;
  return next();
});

/*
-- findOne middlewares -
------------------------
*/

TopicSchema.pre('findOne', next=> next());

TopicSchema.post('findOne', function(doc, next){
  if (doc === null) {
    return next(resObj.topicNotExist());
  } else {
    doc.__v = undefined;
    return next();
  }
});

TopicSchema.post('findOne', function(error, doc, next){
  if (error) {
    if (error.success === false) {
      return next(error);
    } else {
      return next(resObj.databaseError(error));
    }
  }
});

TopicRSchema = TopicSchema;
TopicRSchema.plugin(random);

exports.Topic = mongoose.model('topics', TopicSchema);
exports.TopicR = mongoose.model('topics', TopicRSchema);
