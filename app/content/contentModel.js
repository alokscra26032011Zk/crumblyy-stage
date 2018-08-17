
/*
crumblyy-backend
contentModel
@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-04-13 by Saksham
@note Updates :
  Saksham - 2018 04 25 - recent - removing default handling
  Saksham - 2018 04 26 - recent - update hack middlewares
  Saksham - 2018 05 05 - recent - json parsing
  Saksham - 2018 05 22 - recent - changes in model , condition check for date etc...
*/
const mongoose = require('mongoose');
const random = require('mongoose-random');

const C = require('../../utils/constants');
const utils = require('../../utils/utitlities');
const timeHandler = require('../../utils/timeHandler');
const resObj = require('../response/resObj');
const shortid = require('shortid');
const { Schema } = mongoose;

let create = false;
let read = false;

const ContentSchema = new Schema({
// if hack submitted by 3rd party is approved by moderators
  approved: {
    type: Boolean,
    default: false
  },
// time stamp when the hack is approved
  approvedOn: {
    type: String,
    default: null
  },
// audience hack should be targeting
  audience: {
    type: {
      gender: {
        type: String,
        default: C.GENERAL
      },
      country: {
        type: String,
        default: C.GLOBAL
      }
    },
    default: null
  },
// author for the hack
  author: {
    type: {
      aid: {
        type: String
      },
      name: {
        type: String
      },
      dp: {
        type: String
      }
    },
    default: {
      aid: "tnine",
      name: C.TNINE,
      dp: C.TNINE_DP
    }
  },
// if hack is available to the user
  available: {
    type: Boolean,
    default: false
  },
// bookmarks for the hack
  bookmarks: {
    type: Number,
    default: 0
  },
// category for the hack
  category: {
    type: {
      cid: String,
      name: String
    },
    default: null
  },
// comments on a hack
  comments: [{
    uid: String,
    fullname: String,
    text: String,
    createdAt: String,
    updatedAt: String
  }
  ],
// body for the hack
  contentBody: [{
    lang: {
      type: String,
      default: C.ENG
    },
    text: {
      type: String,
      default: null
    }
  }
  ],
// created at
  createdAt: String,
// external link to the hack
  externalLink: {
    type: String,
    default: null
  },
// if the hack is reported/flagged by the community
  flagged: {
    type: Boolean,
    default: false
  },
// type of hack
  hackType: {
    type: String,
    default: null
  },
// unique hack id
  hid: {
    type: String,
    unique: true
  },
// link for images in the hack
  images: [
    {url: String}
  ],
// no of shares for the hack
  shares: {
    type: Number,
    default: 0
  },
// tags in the hack
  tags: [{
    tid: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  }
  ],
// title for the hack
  title: [{
    lang: {
      type: String,
      default: C.ENG
    },
    text: {
      type: String,
      default: null
    }
  }
  ],
// topic for the hack
  topic: {
    type: {
      tid: String,
      name: String
    },
    default: null
  },
// updated at
  updatedAt: String,
// upvotes for the hack
  upvotes: {
    type: Number,
    default: 0
  },
//link for videos in the hack
  videos: [
    {url: String}
  ]});


// used to set null on empty array keys on save
ContentSchema.pre('save', function(next){
  const jsonKeys = [C.AUDIENCE, C.AUTHOR, C.CATEGORY, C.COMMENTS, C.CONTENT_BODY, C.IMAGES, C.TAGS, C.TITLE, C.VIDEOS];

  create = true;
  read = false;
  let error = false;
  // if we get an empty array , set the key null
  for (let key in ContentSchema.paths) {
    if (utils.typeOf(this[key]) === C.ARRAY) {
      if (this[key].length === 0) {
        this[key] = null;
      }
    }

    if ((jsonKeys.indexOf(key) > -1) && (this[key] !== null)) {
      try {
        if (utils.typeOf(this[key]) === C.STRING) {
          this[key] = JSON.parse(this[key]);
        }
      } catch (err) {
        next(resObj.malformed(`Cast to JSON failed for [${key}]`));
        error = true;
      }
    }
  }

  if (error === false) {
    return next();
  }
});

//used for saving generated ids
ContentSchema.pre('save', function(next){
  this.hid = shortid.generate();
  if (this.createdAt === C.STRING) {
    this.createdAt = timeHandler.currentUTC();
  }
  if (this.updatedAt === C.STRING) {
    this.updatedAt = timeHandler.currentUTC();
  }
  return next();
});

// handling errors
ContentSchema.post('save', function(error, doc, next) {
  if (error) {
    if (error.success === false) {
      return next(error);
// if duplicate hid is created
    } else if (error.message && error.message.includes('hid_1 dup key')) {
      return next(resObj.hackAlreadyExists());
// if _id exists
    } else if (error.message && error.message.includes('_id_ dup key')) {
      return next(resObj.idAlreadyExists());
// if json is malformed / any other variable is
    } else if (error.errors) {
      const key = Object.keys(error.errors);
      const { message } = error.errors[key[0]];
      const text = message.substring(0, message.indexOf('value'));
      return next(resObj.malformed(text + `[${error.errors[key[0]].path}]`));
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


ContentSchema.pre('find', next => next());

ContentSchema.post('find', (doc, next) => next());

ContentSchema.post('find', (err, doc, next) => next());

/*
-- findOne middlewares -
------------------------
*/

ContentSchema.pre('findOne', function(next){
  create = false;
  read = true;
  return next();
});

ContentSchema.post('findOne', function(doc, next){
  if (read) {
    if (doc === null) {
      return next(resObj.hackNotExist());
    } else {
      doc.__v = undefined;
      return next();
    }
  } else {
    return next();
  }
});

ContentSchema.post('findOne', function(error, doc, next){
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

ContentSchema.pre('findOneAndUpdate', function(next){
  const noChangeKeys = ['_id', 'hid', 'createdAt'];
  const jsonKeys = [C.AUDIENCE, C.AUTHOR, C.CATEGORY, C.COMMENTS, C.CONTENT_BODY, C.IMAGES, C.TAGS, C.TITLE, C.VIDEOS];

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

  this.getUpdate()['updatedAt'] = timeHandler.currentUTC();
  return next();
});

ContentSchema.post('findOneAndUpdate', function(doc, next) {
  if (doc === null) {
    return next(resObj.hackNotExist());
  } else {
    doc.__v = undefined;
    return next();
  }
});

ContentSchema.post('findOneAndUpdate', function(err, doc, next) {
  if (err && (err.success === false)) {
    return next(err);
  } else {
    return next(resObj.databaseError(error));
  }
});

ContentRSchema = ContentSchema;
ContentRSchema.plugin(random);

exports.Content = mongoose.model('hacks', ContentSchema);
exports.ContentR = mongoose.model('hacks', ContentRSchema);