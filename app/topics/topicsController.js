
/*
crumblyy-backend
topicsController

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-21 by Saksham
@note Updates :
*/
const { Topic } = require('./topicsModel');
const Log = require('../logger/logging');
const logHandler = require('../logger/logHandler');
const C = require('../../utils/constants');

/*
----- EXPORTS -----
*/

// create a new category
exports.create = details =>
  new Promise(function(resolve, reject){
    return Topic.create(details).then(category=> resolve(JSON.parse(JSON.stringify(category)))).catch(function(error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_TOPIC_CREATE, details, error));});
  })
;

// get a category
exports.get = function(tid, details) {
  if (details == null) { details = ''; }
  return new Promise(function(resolve, reject){
    details = details.split(',').join(' ');
    return Topic.findOne().where('tid').equals(tid).select(details).then(category=> resolve(JSON.parse(JSON.stringify(category)))).catch(function(error){
      reject(error);
      const input = {
        tid,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_TOPIC_READ, input, error));});
  });
};

// update a tag with its id
exports.update = async (_id, details) => {
  return await Topic.findOneAndUpdate({_id}, details, {new: true})
  .then(newDetails=> {
    console.log(newDetails);
    
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
  return Topic.deleteOne({_id}).then(function(data){
    log.o.i(data);
    if (data.n > 0) {
      return resolve(data);
    } else {
      return reject(resObj.topicNotExist());
    }
  }).catch(function(error) {
    reject(resObj.databaseError(error));
    return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_DELETE, _id, error));});
})
;