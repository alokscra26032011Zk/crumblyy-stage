
/*
crumblyy-backend
bannersModel

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-04-27 by Saksham
@note Updates :
*/
const mongoose = require('mongoose');
const random = require('mongoose-random');

//C = require '../../utils/constants'
//utils = require '../../utils/utitlities'
const timeHandler = require('../../utils/timeHandler');
const resObj = require('../response/resObj');
const { Schema } = mongoose;

const BannersSchema = new Schema({
// image link on the banner
  bannerImage: {
    type: String,
    required: true
  },
// banner can link to categories / multiple list of cards / single card etc.
  bannerLink: {
    type: {
      typeofLink: {
        type: String
      },
      link: {
        type: Schema.Types.Mixed
      }
    },
    required: true
  },
//created at
  createdAt: String,
// platform on which banner is shown (ios/android/web etc)
  platform: {
    type: String,
    required: true
  },
// order / priority in which banner is shown
  priority: {
    type: Number,
    required: true
  },
// updated at
  updatedAt: String
});

//used for saving generated ids
BannersSchema.pre('save', function(next){
  this.createdAt = timeHandler.currentUTC();
  this.updatedAt = timeHandler.currentUTC();
  return next();
});

// handling errors
BannersSchema.post('save', function(error, doc, next) {
  //next resObj.databaseError(error)
  if (error) {
// if json is malformed / any other variable is
    if (error.errors) {
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
BannersSchema.post('save', function(doc, next){
  this._doc.__v = undefined;
  return next();
});

BannersRSchema = BannersSchema
BannersRSchema.plugin(random)

exports.Banners = mongoose.model('banners', BannersSchema);
exports.BannersR = mongoose.model('banners', BannersRSchema);