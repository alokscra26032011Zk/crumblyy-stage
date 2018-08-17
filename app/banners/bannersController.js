
/*
crumblyy-backend
bannersController

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-04-27 by Saksham
@note Updates :
  Saksham - 2018 05 11 - recent - fixed details parsing
  Saksham - 2018 05 16 - recent - logger
*/
const { Banners } = require('./bannersModel');
const { Content } = require('../content/contentModel');

const C = require('../../utils/constants');
const resObj = require('../response/resObj');
const Log = require('../logger/logging');
const logHandler = require('../logger/logHandler');

/*
----- EXPORTS -----
-------------------
*/

// create banner
exports.create = details =>
  new Promise(function(resolve, reject){
    return Banners.create(details).then(banners=> resolve(JSON.parse(JSON.stringify(banners)))).catch(function(error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_BANNERS_CREATE,details,error));});
  })
;

// get banners
exports.getList = function(platform, details) {
  if (platform == null) { platform = C.ANDROID; }
  if (details == null) { details = "-__v"; }
  return new Promise(function(resolve, reject) {
    details = details.split(',').join(' ');

    return Banners.find().select(details).where(C.PLATFORM).equals(platform).sort(`${C.PRIORITY}`).exec().then(function(banners) {
      if (banners === null) {
        return resolve(null);
      } else {
        return resolve(JSON.parse(JSON.stringify(banners)));
      }
    }).catch(function(error) {
      reject(resObj.databaseError(error));
      return Log.errors.database(logHandler.dataLogError(C.LOG_BANNERS_LIST,details,error));});
  });
};

async function fetchHacks(hid) {
  return await Content.findOne().where('hid').equals(hid).select('').exec()
}

// get populated banner list
exports.getPopulatedList = async (platform, details) => {
  if (platform == null) { platform = C.ANDROID; }
  if (details == null) { details = "-__v"; }
    details = details.split(',').join(' ');
    let allBanners=[]
    let hids = []
    allBanners = await Banners.find().select(details).where(C.PLATFORM).equals(platform).sort(`${C.PRIORITY}`).exec()
    hids =  [...new Set(allBanners.map(item => item.bannerLink))];
    // console.log('hids',hids);

    const promisesToMake = []
    for (var i = 0; i < hids.length; i++) {
      promisesToMake.push(fetchHacks(hids[i]))
    }
    const promises = Promise.all(promisesToMake)
    return promises.then(async (result) => {
      // console.log('Result',result);
      return JSON.parse(JSON.stringify(result))
    })
};

// update a banner with its id
exports.update = async (_id, details) => {
  return await Banners.findOneAndUpdate({_id}, details, {new: true})
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


// delete a banner with its id
exports.delete = _id =>
  new Promise(function(resolve, reject){
    return Banners.deleteOne({id}).then(function(data){
      log.o.i(data);
      if (data.n > 0) {
        return resolve(data);
      } else {
        return reject(resObj.bannerNotExist());
      }
    }).catch(function(error) {
      reject(resObj.databaseError(error));
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_DELETE, _id, error));});
  })
;