
/**
  Create by Saksham on 10th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 11 - recent - new user create
  Saksham - 2018 04 24 - recent - changes to controller based on model
  Saksham - 2018 04 24 - recent - fetch user with uid
  Saksham - 2018 04 24 - recent - update the user
  Saksham - 2018 05 08 - recent - check if gid exists & update
  Saksham - 2018 05 14 - recent - find user with email
  Saksham - 2018 05 17 - recent - Logger
*/
const { Users } = require('./usersModel');
const { Content } = require('../content/contentModel');
const { Category } = require('../categories/categoryModel');

const C = require('../../utils/constants');
const resObj = require('../response/resObj');
const Log = require('../logger/logging');
const logHandler = require('../logger/logHandler');

const recommendation=require('../recommendations/recommendation')
let operationFlag='add'
/*
--------- PRIVATE ------------
------------------------------
*/
const checkHackExists = function (hack, availableHacks) {
  // console.log('Available bookmarks',availableBookmarks);
  // console.log('bookmarkid',bookmark.id);

  if (availableHacks) {
    for (var i = 0; i < availableHacks.length; i++) {
      if (hack.id === availableHacks[i].id) {
        availableHacks.splice(i, 1);
        operationFlag='remove'
        return availableHacks
      }
    }
    operationFlag='add'
    availableHacks.push(hack)
    // console.log('Pushed',availableBookmarks);
    return availableHacks
  } else {
    operationFlag='add'
    let temp = []
    temp.push(hack)
    return temp
  }
}

async function processBookmarks(bookmark) {
  let hid = bookmark.id
  return await Content.findOne().where('hid').equals(hid).select('').exec()
}

async function processBookmarksByCategories(bookmarks) {
  console.log(bookmarks.length);
  
  //find all categories
  let finalResult = {}
  const allCategories = await [...new Set(bookmarks.map(item => item.category.name))];
  // const allCategories = await bookmarks.map(item => item.category.name)
  // .filter((value, index, self) => self.indexOf(value) === index)
  console.log('All categories',allCategories);
  
  for (var i = 0; i < allCategories.length; i++) {
     finalResult[allCategories[i]] = await bookmarks.filter(val => {
      return val.category.name.trim() === allCategories[i].trim();
    });
  }
  return finalResult
}
/*
--------- EXPORTS ------------
------------------------------
*/
// create new user
exports.create = details =>
  new Promise(function (resolve, reject) {
    return Users.create(details).then(user => resolve(JSON.parse(JSON.stringify(user)))).catch(function (error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_USERS_CREATE, details, error));
    });
  })
  ;

// get user with uid
exports.getUid = uid =>
  new Promise(function (resolve, reject) {
    // finding user
    return Users.findOne().where('uid').equals(uid).exec().then(user => resolve(JSON.parse(JSON.stringify(user)))).catch(function (error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_USERS_GET_WITH_UID, uid, error));
    });
  })
  ;

// Get user permissions
exports.userPermissions = uid =>
  new Promise(function (resolve, reject) {
    // finding user
    return Users.findOne().where('uid').equals(uid).select(`${C.PERMISSIONS}`).exec().then(function (user) {
      if (!user || (user === null)) {
        return reject(resObj.userNotExist());
      } else {
        return resolve(user);
      }
    }).catch(function (error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_USERS_PERMISSIONS, uid, error));
    });
  })
  ;

// update a user
exports.update = (uid, details) =>
  new Promise(function (resolve, reject) {
    return Users.findOneAndUpdate({ uid }, details, { new: true }).then(newDetails => resolve(JSON.parse(JSON.stringify(newDetails)))).catch(function (error) {
      reject(error);
      const input = {
        uid,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_USERS_UPDATE, input, error));
    });
  })
  ;

//update bookmarks
exports.updateBookmarks = async (uid, details) => {
  //cHECK IF BOOKmark already exists
  let bookmarks = details.bookmarks;
  let hidToUpdate = bookmarks[0].id
  // console.log(typeof(bookmarks));

  //Find available bookmarks
  let user = await Users.findOne().where('uid').equals(uid).exec()
  let availableBookmarks = user.bookmarks
  let bookmarksToUpdate = checkHackExists(bookmarks[0], availableBookmarks)
  // console.log('Bookmarks to update',bookmarksToUpdate);
  details.bookmarks = bookmarksToUpdate
  // console.log('Details',details);
  return await Users.findOneAndUpdate({ uid }, { $set: { bookmarks: bookmarksToUpdate } }, { new: true })
    .then(async (newDetails) => {
      //Check if hack is added or removed
      if(operationFlag==='remove'){
        //removed
        console.log('removed');
        
        await Content.findOneAndUpdate({ hid: hidToUpdate }, { $inc: { bookmarks: -1 } }, {new: true })
      }else{
        //added
        console.log('added');
        await recommendation.activity.log(uid,hidToUpdate,{type:"interested"},"interested")
        await Content.findOneAndUpdate({ hid: hidToUpdate }, { $inc: { bookmarks: 1 } }, {new: true })
      }
      return JSON.parse(JSON.stringify(newDetails))
    })
    .catch(function (error) {
      // console.log(error);
      const input = {
        uid,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_USERS_UPDATE, input, error));
    });
}

//update upvotes
exports.updateUpvotes = async (uid, details) => {
  //cHECK IF BOOKmark already exists
  let upvotes = details.upvotes;
  let hidToUpdate = upvotes[0].id

  // console.log(typeof(bookmarks));

  //Find available bookmarks
  let user = await Users.findOne().where('uid').equals(uid).exec()
  let availableUpvotes = user.upvotes
  let upvotesToUpdate = checkHackExists(upvotes[0], availableUpvotes)
  // console.log('Bookmarks to update',bookmarksToUpdate);
  details.upvotes = upvotesToUpdate
  // console.log('Details',details);
  return await Users.findOneAndUpdate({ uid }, { $set: { upvotes: upvotesToUpdate } }, { new: true })
    .then(async (newDetails) => {
      // console.log(newDetails);
      if(operationFlag==='remove'){
        //removed
        console.log('removed');
        
        await Content.findOneAndUpdate({ hid: hidToUpdate }, { $inc: { upvotes: -1 } }, {new: true })
      }else{
        //added
        console.log('added');
        await recommendation.activity.log(uid,hidToUpdate,{type:"interested"},"interested")
        await Content.findOneAndUpdate({ hid: hidToUpdate }, { $inc: { upvotes: 1 } }, {new: true })
      }
      return JSON.parse(JSON.stringify(newDetails))
    })
    .catch(function (error) {
      // console.log(error);
      const input = {
        uid,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_USERS_UPDATE, input, error));
    });
}

//update shares
exports.updateShares = async (uid, details) => {
  //cHECK IF BOOKmark already exists
  let shares = details.shares;
  let hid = shares[0].id
  let sharelogged = await recommendation.activity.log(uid,hid,{type:"interested"},"interested")  
  return sharelogged

}

//get bookmarks of user
exports.getBookmarks = async (uid) => {
  //Find available bookmarks
  let user = await Users.findOne().where('uid').equals(uid).exec()
  if (user.bookmarks) {
    let availableBookmarks = user.bookmarks.reverse()
    const promisesToMake = []
    for (var i = 0; i < availableBookmarks.length; i++) {
      promisesToMake.push(processBookmarks(availableBookmarks[i]))
    }
    const promises = Promise.all(promisesToMake)
    return promises.then(async (results) => {
      let finalResult = await processBookmarksByCategories(results)
      return JSON.parse(JSON.stringify(finalResult))
    })
  }else{
    let empty ={}
    return JSON.parse(JSON.stringify({}))
  }
}

//get bookmarks of user
exports.getAllBookmarks = async (uid) => {
  //Find available bookmarks
  let user = await Users.findOne().where('uid').equals(uid).exec()
   
  if (user.bookmarks) {
    let availableBookmarks = user.bookmarks.reverse();
    const promisesToMake = []
    for (var i = 0; i < availableBookmarks.length; i++) {
      promisesToMake.push(processBookmarks(availableBookmarks[i]))
    }
    const promises = Promise.all(promisesToMake)
    return promises.then(async (results) => {
      return JSON.parse(JSON.stringify(results))
    })
  }else{
    let empty ={}
    return JSON.parse(JSON.stringify({}))
  }

}

// check if gid already exists
exports.findUserWithGID = (gid, email) =>
  new Promise(function (resolve, reject) {
    return Users.findOneAndUpdate({ "$or": [{ gid }, { email }] }, { gid }, { new: true }).then(user => resolve(JSON.parse(JSON.stringify(user)))).catch(function (error) {
      reject(error);
      const input = {
        gid,
        email
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_USERS_FIND_WITH_GID, input, error));
    });
  })
  ;

// get user with uid
exports.findUserWithEmail = email =>
  new Promise(function (resolve, reject) {
    // finding user
    return Users.findOne().where('email').equals(email).exec().then(user => resolve(JSON.parse(JSON.stringify(user)))).catch(function (error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_USERS_FIND_WITH_EMAIL, email, error));
    });
    //Log.errors.database(logHandler.dataLogError C.LOG_USER_UPDATE_PERMISSIONS, userId, error)
  })
  ;

  async function fetchHacks(hid) {
    return await Content.findOne().where('hid').equals(hid).select('').exec()
  }
  

// get personalized recommendations
exports.getPersonalizedRecommendations = async (uid) => {
  await recommendation.run()
  let recommendationList=[]
  let recommendationObject = await recommendation.recommendation.getAllRecommendationsForUser(uid);
  if(recommendationObject){
    recommendationList = recommendationObject.recommendations;
  }
  let hids =  [...new Set(recommendationList.map(item => item.item))];  
  const promisesToMake = []
    for (var i = 0; i < hids.length; i++) {
      promisesToMake.push(fetchHacks(hids[i]))
    }
    const promises = Promise.all(promisesToMake)
    return promises.then(async (result) => {
      // console.log('Result',result);
      return JSON.parse(JSON.stringify(result))
    })

}
  