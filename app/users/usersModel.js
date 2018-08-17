
/**
  Create by Saksham on 10th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 24 - recent - changes to models with pre & post
  Saksham - 2018 05 05 - recent - update user middlewares
*/
const mongoose = require('mongoose');
const random = require('mongoose-random');

const shortid = require('shortid');
const uuid = require('uuid/v4');
const C = require('../../utils/constants');
const timeHandler = require('../../utils/timeHandler');
const resObj = require('../response/resObj');
const utils = require('../../utils/utitlities');

const { Schema } = mongoose;

const UserSchema = new Schema({
// bookmarks
  bookmarks: [
    {id: String}
  ],
// country
  country: {
    type: String,
    default: null
  },
// createdAt
  createdAt: String,
// display picture
  dp: {
    type: String,
    default: null
  },
// email
  email: {
    type: String,
    index: true,
    unique: true
  },
// fcm token
  fcmToken: {
    type: String,
    default: null
  },
// fid
  fid: {
    type: String,
    default: null
  },
// fullname
  fullname: {
    type: String,
    default: null
  },
// gender
  gender: {
    type: String,
    default: null
  },
// gid
  gid: {
    type: String,
    default: null
  },
// permissions
  permissions: [String],
// password
  password: String,
// phone
  phone: {
    type: String,
    default: null
  },
// uid
  uid: {
    type: String,
    index: true,
    unique: true
  },
// username
  username: {
    type: String,
    default: null,
    unique: true
  },
// updated at
  updatedAt: String,
// upvotes
  upvotes: [
    {id: String}
  ],
// verified
  verified: {
    type: Boolean,
    default: false
  }
});

let create = false;
let read = false;

/*
--- save middlewares ---
------------------------
*/

// used to handle
UserSchema.pre('save', function(next){
  create = true;
  read = false;
  // if we get an empty array , set the key null
  for (let key in UserSchema.paths) {
    if (utils.typeOf(this[key]) === C.ARRAY) {
      if (this[key].length === 0) {
        this[key] = null;
      }
    }
  }
  return next();
});

// used to set values
UserSchema.pre('save', function(next){
  this.uid = uuid();
  this.username = shortid.generate();
  this.createdAt = timeHandler.currentUTC();
  this.updatedAt = timeHandler.currentUTC();
  return next();
});

// handling errors
UserSchema.post('save', function(error, doc, next) {
  if (error) {
    if (error.message && error.message.includes('uid_1 dup key')) {
      return next(resObj.userAlreadyExists('duplicate [uid]'));
    } else if (error.message && error.message.includes('email_1 dup key')) {
      return next(resObj.userAlreadyExists('duplicate [email]'));
    } else if (error.message && error.message.includes('username_1 dup key')) {
      return next(resObj.userAlreadyExists('duplicate [username]'));

// if json is malformed / any other variable is
    } else if (error.errors) {
      const key = Object.keys(error.errors);
      const { message } = error.errors[key[0]];
      const text = message.substring(0, message.indexOf('value'));
      return next(resObj.malformed(text + `[${error.errors[key[0]].path}]`));
    } else if (error.success === false) {
      return next(error);
//other errors
    } else {
      return next(resObj.databaseError(error.toString()));
    }
  }
});

// removing non essential fields from returned document
UserSchema.post('save', function(doc, next){
  doc.__v = undefined;
  doc.password = undefined;
  return next();
});


/*
-- findOne middlewares -
------------------------
*/

UserSchema.pre('findOne', function(next){
  create = false;
  read = true;
  return next();
});

UserSchema.post('findOne', function(doc, next){
  if (read) {
    if (doc === null) {
      return next(resObj.userNotExist());
    } else {
      doc.__v = undefined;
      return next();
    }
  } else {
    return next();
  }
});

UserSchema.post('findOne', function(error, doc, next){
  if (error) {
    if (error.success === false) {
      return next(error);
    } else {
      return next(resObj.databaseError(error));
    }
  }
});

/*
-- update middlewares -
------------------------
*/

UserSchema.pre('findOneAndUpdate', function(next){
  const noChangeKeys = ['_id', C.UID, C.CREATED_AT, C.PERMISSIONS, C.PASSWORD, C.EMAIL];
  const jsonKeys = [C.BOOKMARKS, C.UPVOTES];

  if (this.getUpdate() && (Object.keys(this.getUpdate()).length === 1) && this.getUpdate()[C.PASSWORD]) {
// only password will be updated in this case
  } else {
    for (let key in this.getUpdate()) {
      if (jsonKeys.indexOf(key) > -1) {
        try {
          this.getUpdate()[key] = utils.toJSONSync(this.getUpdate()[key]);
        } catch (error) {
          next(resObj.malformed(`Cast to JSON failed for [${key}]`));
        }
      }

      if (utils.typeOf(this.getUpdate()[key]) === C.ARRAY) {
        if (this.getUpdate()[key].length === 0) {
          this.getUpdate()[key] = null;
        }
      }

      if (noChangeKeys.indexOf(key) > -1) {
        delete this.getUpdate()[key];
      }
    }
  }

  if (this.getUpdate()) {
    this.getUpdate()['updatedAt'] = timeHandler.currentUTC();
  }
  return next();
});

UserSchema.post('findOneAndUpdate', function(doc, next) {
  if (doc === null) {
    return next(resObj.userNotExist());
  } else {
    doc.__v = undefined;
    doc.password = undefined;
    return next();
  }
});

UserSchema.post('findOneAndUpdate', function(err, doc, next) {
  if (err && (err.success === false)) {
    return next(err);
  } else {
    return next(resObj.databaseError(err));
  }
});

UserRSchema = UserSchema;
UserRSchema.plugin(random);

const UserR = mongoose.model('users', UserRSchema);
const Users = mongoose.model('users', UserSchema);
exports.Users = Users;
exports.UserR = UserR;