
/*
crumblyy-backend
tagsController

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-02 by Saksham
@note Updates :
  Saksham - 2018 05 07 - recent - getByName
  Saksham - 2018 05 09 - recent - get list of tags (search on name)
  Saksham - 2018 05 11 - recent - fixed details parsing
  Saksham - 2018 05 17 - recent - Logger
*/
const { Tags } = require('./tagsModel');
const resObj = require('../response/resObj');
const Log = require('../logger/logging');
const logHandler = require('../logger/logHandler');
const C = require('../../utils/constants');

/*
--------- EXPORTS ----------
*/

// create a tag
exports.create = details =>
  new Promise(function(resolve, reject){
    return Tags.create(details).then(tag=> resolve(JSON.parse(JSON.stringify(tag)))).catch(function(error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_TAGS_CREATE, details, error));});
  })
;

// get a tag by id
exports.getById = function(tid, details) {
  if (details == null) { details = ''; }
  return new Promise(function(resolve, reject){
    return Tags.findOne().where('tid').equals(tid).select(details).exec().then(tag=> resolve(JSON.parse(JSON.stringify(tag)))).catch(function(error) {
      reject(error);
      const input = {
        tid,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_TAGS_GET_BY_ID, input, error));});
  });
};

// get list of tags (search on name)
exports.searchListByName = function(search, offset, limit, details) {
  if (offset == null) { offset = 0; }
  if (limit == null) { limit = 10; }
  if (details == null) { details = ''; }
  return new Promise(function(resolve, reject){
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (offset > 0) {
      offset = offset - 1;
    }

    details = details.split(',').join(' ');

    return Tags.find({
      name: {
        $regex: search.replace(/\s+/g, "\\s+"),
        $options: "i"
      }
    }).select(details).skip(offset * limit).limit(limit).sort({name: 1}).exec().then(function(tags){
      if (tags === null) {
        return resolve(null);
      } else {
        return resolve(JSON.parse(JSON.stringify(tags)));
      }
    }).catch(function(error) {
      reject(resObj.databaseError(error));
      const input = {
        search,
        offset,
        limit,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_TAGS_LIST_BY_NAME, input, error));});
  });
};

// update a tag with its id
exports.update = async (_id, details) => {
    return await Tags.findOneAndUpdate({_id}, details, {new: true})
    .then(newDetails=> {
      return JSON.parse(JSON.stringify(newDetails))
    })
    .catch(function(error){
      const input = {
        _id,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_UPDATE, input, error));
    });
}



// delete a tag with its id
exports.delete = _id =>
  new Promise(function(resolve, reject){
    return Tags.deleteOne({_id}).then(function(data){
      log.o.i(data);
      if (data.n > 0) {
        return resolve(data);
      } else {
        return reject(resObj.tagNotExist());
      }
    }).catch(function(error) {
      reject(resObj.databaseError(error));
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_DELETE, _id, error));});
  })
;