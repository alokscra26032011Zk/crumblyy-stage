
/*
crumblyy-backend
categoryController

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-21 by Saksham
@note Updates :
*/
const { Category } = require('./categoryModel');
const { Content } = require('../content/contentModel');
const { Users } = require('../users/usersModel');

const Log = require('../logger/logging');
const logHandler = require('../logger/logHandler');
const C = require('../../utils/constants');

/*
----- EXPORTS -----
*/

// create a new category
exports.create = details =>
  new Promise(function(resolve, reject){
    return Category.create(details).then(category=> resolve(JSON.parse(JSON.stringify(category)))).catch(function(error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_CATEGORY_CREATE, details, error));});
  })
;

// get a category
exports.get = function(cid, details) {
  if (details == null) { details = ''; }
  return new Promise(function(resolve, reject){
    details = details.split(',').join(' ');
    return Category.findOne().where('cid').equals(cid).select(details).then(category=> resolve(JSON.parse(JSON.stringify(category)))).catch(function(error){
      reject(error);
      const input = {
        cid,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CATEGORY_READ, input, error));});
  });
};

// get all category wise hacks
exports.getAllCategoryWiseHacks = function(limit) {
  if (limit == null) { limit = 10; }
  return new Promise(function(resolve, reject){
      return Category.aggregate([
            {
              $lookup: {
                from: 'hacks',
                localField: "cid",
                foreignField: "category.cid",
                as: 'unsortedHacks'
              }
            },
            {$unwind: '$unsortedHacks'}, 
            {$sort: {'unsortedHacks.createdAt': 1}}, 
            {$group: {_id: '$_id', 'hacks': {$push: '$unsortedHacks'}}}, 
            {
              $project:{
                _id: 1,
                name: 1,
                total_no_of_hacks:{$size: "$hacks"},
                hacks: {$slice: ["$hacks",10,eval(limit)]}
              }
            }
          ])
        .exec(function(error,results) {
            if (error === null) {
              resolve(JSON.parse(JSON.stringify(results)));
            } else {
              log.o.e(error);
              reject(require('../response/resObj').databaseError(error));
            }
            const input = '';
            return Log.errors.database(logHandler.dataLogError(C.LOG_CATEGORY_LIST, input, error));
        });
  });
};

// get category wise hacks
exports.getCategoryWiseHacks = function(id,limit) {
  if (limit == null) { limit = 10; }
  return new Promise(function(resolve, reject){
      return Category.aggregate([
            {
              $lookup: {
                from: 'hacks',
                localField: "cid",
                foreignField: "category.cid",
                as: 'unsortedHacks'
              }
            },
            {$unwind: '$unsortedHacks'}, 
            {$sort: {'unsortedHacks.createdAt': 1}}, 
            {$group: {_id: '$_id', 'hacks': {$push: '$unsortedHacks'}}},
            {
              $project:{
                _id: 1,
                name: 1,
                total_no_of_hacks:{$size: "$hacks"},
                hacks: {$slice: ["$hacks",10,eval(limit)]}
              }
            }
          ])
        .exec(function(error,results) {
            if (error === null) {
              resolve(JSON.parse(JSON.stringify(results)));
            } else {
              log.o.e(error);
              reject(require('../response/resObj').databaseError(error));
            }
            const input = '';
            return Log.errors.database(logHandler.dataLogError(C.LOG_CATEGORY_LIST, input, error));
        });
  });
};
      
      
// update a category with its id
exports.update = async (_id, details) => {
  return await Category.findOneAndUpdate({_id}, details, {new: true})
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


// delete a category with its id
exports.delete = _id =>
  new Promise(function(resolve, reject){
    return Category.deleteOne({id}).then(function(data){
      log.o.i(data);
      if (data.n > 0) {
        return resolve(data);
      } else {
        return reject(resObj.categoryNotExist());
      }
    }).catch(function(error) {
      reject(resObj.databaseError(error));
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_DELETE, _id, error));});
  })
;
    
