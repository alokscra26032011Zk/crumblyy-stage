
/*
crumblyy-backend
contentController

@author Saksham
     
@note Created on 2018-04-17 by Saksham
@note Updates :
  Saksham - 2018 04 24 - recent - put controller
  Saksham - 2018 04 27 - recent - get list of hacks to review
  Saksham - 2018 04 27 - recent - create flag hack entry
  Saksham - 2018 05 07 - recent - findContentWithTagId
  Saksham - 2018 05 07 - recent - content search
  Saksham - 2018 05 09 - recent - pagination in content body search
  Saksham - 2018 05 10 - recent - get list of content grouped by category
  Saksham - 2018 05 11 - recent - get list of content sorted by date + after an id
  Saksham - 2018 05 16 - recent - logger
  Alok    - 2018 06 28 - recent - Modified Schema change fields(tags,category,topic)
*/
const { Content, ContentR } = require('./contentModel');
const { Category } = require('../categories/categoryModel');
const { Tags } = require('../tags/tagsModel');
const { Topic } = require('../topics/topicsModel');

const Flag = require('./contentFlagModel').FLAG;
const resObj = require('../response/resObj');
const C = require('../../utils/constants');
const Log = require('../logger/logging');
const logHandler = require('../logger/logHandler');
const shortid = require('shortid');
const mongoose = require('mongoose');
const fs = require('fs')
const firebase = require('firebase');


firebase.initializeApp({
  databaseURL: 'https://lifehacks-27d7e.firebaseio.com/',
  serviceAccount: '../firebase/firebase.json', //this is file that I downloaded from Firebase Console
});

/*
-------- EXPORTS ----------
---------------------------
*/
const asyncOperation = function (model, search, offset, limit, details) {
  if (search == null) { search = "----"; }
  if (offset == null) { offset = 0; }
  if (limit == null) { limit = 10; }
  if (details == null) { details = '-__v'; }
  console.log(model);
  return new Promise(function (resolve, reject) {
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (offset > 0) {
      offset = offset - 1;
    }
    // since double quotes in getting include in the search we are removing first & last char - "
    search = search.substring(1, search.length - 1);
    details = details.split(',').join(' ');
    if (model === 'Content') {
      Content.find({
        "contentBody": {
          $elemMatch: {
            "text": {
              $regex: search.replace(/\s+/g, "\\s+"),
              $options: "i"
            }
          }
        }
      }).select(details).sort({ upvotes: -1 }).skip(offset * limit).limit(limit).exec().then(function (hacks) {

        if (hacks === null) {
          resolve(null);
        } else {
          resolve(JSON.parse(JSON.stringify(hacks)));
        }
        return console.log(hacks);
      }).catch(error => reject(require('../response/resObj').databaseError(error)));
    }

    if (model === 'Category') {
      Category.find({
        "name": {
          $regex: search.replace(/\s+/g, "\\s+"),
          $options: "i"
        }
      }).exec().then(function (category) {
        if (category === null) {
          resolve(null);
        } else {
          resolve(JSON.parse(JSON.stringify(category)));
        }
        return console.log('Category', category);
      }).catch(error => reject(require('../response/resObj').databaseError(error)));
    }

    if (model === 'Tags') {
      Tags.find({

        "name": {
          $regex: search.replace(/\s+/g, "\\s+"),
          $options: "i"
        }

      }).exec().then(function (tags) {
        if (tags === null) {
          resolve(null);
        } else {
          resolve(JSON.parse(JSON.stringify(tags)));
        }
        return console.log('Tags', tags);
      }).catch(error => reject(require('../response/resObj').databaseError(error)));
    }

    if (model === 'Topic') {
      return Topic.find({
        "name": {
          $regex: search.replace(/\s+/g, "\\s+"),
          $options: "i"
        }

      }).exec().then(function (topic) {
        if (topic === null) {
          resolve(null);
        } else {
          resolve(JSON.parse(JSON.stringify(topic)));
        }
        return console.log('Topics', topic);
      }).catch(error => reject(require('../response/resObj').databaseError(error)));
    }

  });
};
// create a new hack
exports.create = details =>
  new Promise(function (resolve, reject) {
    return Content.create(details).then(async (hack) => {
      hack = JSON.parse(JSON.stringify(hack));
      await firebase.database().ref('/upvotes/' + hack.hid).set({
        count: hack.upvotes
      });
      return resolve(hack);
    }).catch(function (error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_CREATE, details, error));
    });
  })
  ;

// get a hack with its hid
exports.get = function (hid, details) {
  if (details == null) { details = ''; }
  return new Promise(function (resolve, reject) {
    details = details.split(',').join(' ');
    return Content.findOne().where('hid').equals(hid).select(details).exec().then(hack => resolve(JSON.parse(JSON.stringify(hack)))).catch(function (error) {
      reject(error);
      const input = {
        hid,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_GET, input, error));
    });
  });
};

// update a hack with its hid
exports.update = (hid, details) =>
  new Promise(function (resolve, reject) {
    return Content.findOneAndUpdate({ hid }, details, { runValidators: true, new: true }).then(newDetails => resolve(JSON.parse(JSON.stringify(newDetails)))).catch(function (error) {
      reject(error);
      const input = {
        hid,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_UPDATE, input, error));
    });
  })
  ;

// delete a hack with its hid
exports.delete = hid =>
  new Promise(function (resolve, reject) {
    return Content.deleteOne({ hid }).then(function (data) {
      log.o.i(data);
      if (data.n > 0) {
        return resolve(data);
      } else {
        return reject(resObj.hackNotExist());
      }
    }).catch(function (error) {
      reject(resObj.databaseError(error));
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_DELETE, hid, error));
    });
  })
  ;

// get review hacks list (sorted by date)
exports.getReviewList = function (details) {
  if (details == null) { details = '-__v'; }
  return new Promise(function (resolve, reject) {
    details = details.split(',').join(' ');

    return Content.find().select(details).where(C.APPROVED).equals(false).sort({ createdAt: -1 }).exec().then(function (hacks) {
      if (hacks === null) {
        return resolve(null);
      } else {
        return resolve(JSON.parse(JSON.stringify(hacks)));
      }
    }).catch(function (error) {
      reject(resObj.databaseError(error));
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_REVIEW_LIST, details, error));
    });
  });
};

// create a flag for the hack
exports.createFlag = details =>
  new Promise(function (resolve, reject) {
    return Flag.create(details).then(det => resolve(JSON.parse(JSON.stringify(det)))).catch(function (error) {
      reject(error);
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_CREATE_FLAG), details, error);
    });
  })
  ;
const checkHackExists = function (hid, hacks) {
  if (hacks) {
    for (var i = 0; i < hacks.length; i++) {
      if (hid === hacks[i].hid) {
        hacks.splice(i, 1);
        return hacks
      }
    }
    return hacks
  } else {
    let temp = []
    return temp
  }
}
// get list of content with tag
exports.findContentWithTagId = function (tid, offset, limit, details) {
  if (tid == null) { tid = ""; }
  if (offset == null) { offset = 0; }
  if (limit == null) { limit = 30; }
  if (details == null) { details = '-__v'; }
  return new Promise(function (resolve, reject) {
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (offset > 0) {
      offset = offset - 1;
    }

    details = details.split(',').join(' ');

    //  Content.aggregate([
    //         {$unwind: '$tags'},
    //         {
    //           $lookup: {
    //             from: 'tags',
    //             localField: "tags",
    //             foreignField: "_id",
    //             as: 'tag'
    //           }
    //         },
    //         {$match: {"tag.tid": eval(tid)}},
    //         {$sort: {upvotes: -1}},
    //         {$skip: offset * limit },
    //         {$limit:eval(limit)}

    //       ])
    //       .exec((error,results) ->
    //         if error is null
    //           resolve JSON.parse(JSON.stringify(results))
    //         else
    //           log.o.e error
    //           # reject require('../response/resObj').databaseError(error)
    //           reject resObj.databaseError(error)
    //         input =
    //           tid: tid
    //           offset: offset
    //           limit: limit
    //           details: details
    //         Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_FIND_CONTENT_WITH_TAG, input, error))
    //     )

    return Content.find({
      "tags": { $elemMatch: { "tid": tid } }
    }).select(details).sort({ upvotes: -1 }).skip(offset * limit).limit(limit).exec().then(function (hacks) {
      if (hacks === null) {
        return resolve(null);
      } else {
        return resolve(JSON.parse(JSON.stringify(hacks)));
      }
    }).catch(function (error) {
      reject(resObj.databaseError(error));
      const input = {
        tid,
        offset,
        limit,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_FIND_CONTENT_WITH_TAG, input, error));
    });
  });
};
// get list of similar hacks
exports.similarHacks = async (tid, cid, hid, offset, limit, details) => {
  if (tid == null) { tid = ""; }
  if (offset == null) { offset = 0; }
  if (limit == null) { limit = 30; }
  if (details == null) { details = '-__v'; }
  return new Promise(async (resolve, reject) => {
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (offset > 0) {
      offset = offset - 1;
    }

    details = details.split(',').join(' ');
    let hacksByCategory = await Content.find({ "category.cid": cid }).limit(10).sort({
      "createdAt": -1
    }).exec()
    return Content.find({
      "tags": { $elemMatch: { "tid": tid } }
    }).exec().then(async (hacksByTags) => {
      if (hacksByTags === null) {
        return resolve(null);
      } else {
        let finalHacksByCategory = await checkHackExists(hid, hacksByCategory)
        let finalHacksByTags = await checkHackExists(hid, hacksByTags)

        let hacks = finalHacksByTags.concat(finalHacksByCategory)
        // console.log('hacks',hacks.length);
        hacks.splice(10)
        return resolve(JSON.parse(JSON.stringify(hacks)));
      }
    }).catch(function (error) {
      reject(resObj.databaseError(error));
      const input = {
        tid,
        offset,
        limit,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_FIND_CONTENT_WITH_TAG, input, error));
    });
  });
};
// get list of trending hacks
exports.trendingHacks = async (tid, cid, hid, offset, limit, details) => {
  // mongodb mapReduce
  Content.aggregate([
    {
      $project:
      {
        item: "$_id",
        ranking: {
          $divide: [
            {
              $add: [
                "$upvotes",
                "$bookmarks",
                0.75
              ]
            }, //end $add
            {
              $add: [
                1,
                {
                  $subtract: [
                    {
                      $multiply: [
                        {
                          $multiply: [
                            { $divide: [{ $subtract: [new Date(), { $dateFromString: { dateString: "$createdAt" } }] }, 14400000] },
                            .4
                          ]
                        }, //end $multiply
                        {
                          $multiply: [
                            { $divide: [{ $subtract: [new Date(), { $dateFromString: { dateString: "$createdAt" } }] }, 14400000] },
                            .4
                          ]
                        } //end $multiply
                      ]
                    }, //end $multiply
                    {
                      $multiply: [
                        {
                          $multiply: [
                            {
                              $subtract: [
                                { $divide: [{ $subtract: [new Date(), { $dateFromString: { dateString: "$createdAt" } }] }, 14400000] },
                                { $divide: [{ $subtract: [new Date(), { $dateFromString: { dateString: "$createdAt" } }] }, 14400000] }
                              ]
                            }, //end $subtract
                            .3
                          ]
                        }, //end $multiply
                        {
                          $multiply: [
                            {
                              $subtract: [
                                { $divide: [{ $subtract: [new Date(), { $dateFromString: { dateString: "$createdAt" } }] }, 14400000] },
                                { $divide: [{ $subtract: [new Date(), { $dateFromString: { dateString: "$createdAt" } }] }, 14400000] }
                              ]
                            }, //end $subtract
                            .3
                          ]
                        } //end $multiply
                      ]
                    } //end $multiply
                  ]
                } //end $subtract
              ]
            } //end $add
          ]
        } //end $divide
      }
    }, //end $project
    { $sort: { ranking: -1 } },
  ]).exec(function (error, results) {
    if (error === null) {
     return JSON.parse(JSON.stringify(results));
    } else {
      console.log(error);
      
      require('../response/resObj').databaseError(error);
    }
    const input = '';
    return Log.errors.database(logHandler.dataLogError(C.LOG_CATEGORY_LIST, input, error));
  });

};
// search content inside body
exports.contentSearch = function (search, offset, limit, details) {
  if (search == null) { search = "----"; }
  if (offset == null) { offset = 0; }
  if (limit == null) { limit = 30; }
  if (details == null) { details = '-__v'; }
  return new Promise(function (resolve, reject) {
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (offset > 0) {
      offset = offset - 1;
    }
    // since double quotes in getting include in the search we are removing first & last char - "
    search = search.substring(1, search.length - 1);
    details = details.split(',').join(' ');

    return Content.find({
      "contentBody": {
        $elemMatch: {
          "text": {
            $regex: search.replace(/\s+/g, "\\s+"),
            $options: "i"
          }
        }
      }
    }).select(details).sort({ upvotes: -1 }).skip(offset * limit).limit(limit).exec().then(function (hacks) {
      if (hacks === null) {
        return resolve(null);
      } else {
        return resolve(JSON.parse(JSON.stringify(hacks)));
      }
    }).catch(function (error) {
      reject(resObj.databaseError(error));
      const input = {
        search,
        offset,
        limit,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_SEARCH, input, error));
    });
  });
};

exports.contentSearchAll = function (search, offset, limit, details) {
  if (search == null) { search = "----"; }
  if (offset == null) { offset = 0; }
  if (limit == null) { limit = 30; }
  if (details == null) { details = '-__v'; }
  const promisesToMake = [asyncOperation('Content', search, offset, limit, details), asyncOperation('Category', search), asyncOperation('Tags', search), asyncOperation('Topic', search)];
  const promises = Promise.all(promisesToMake);
  return promises.then(results => JSON.parse(JSON.stringify({ hacks: results[0], category: results[1], tags: results[2], topics: results[3] })));
};

// random hacks
exports.randomHacks = function ({ limit, details }) {
  if (limit == null) { limit = 30; }
  if (details == null) { details = '-__v'; }
  // ContentR.syncRandom(function (err, result) {
  //   console.log(result.updated);
  // });
  return new Promise(function (resolve, reject) {
    fields = {
      __v: 0,
    };
    if (limit !== 30) {
      try {
        limit = parseInt(limit);
      } catch (error1) {
        error = error1;
        limit = 30;
      }
    }
    options = {
      limit: limit
    };
    return ContentR.findRandom({}, fields, options).then(function (hacks) {
      if (hacks === null) {
        return resolve(null);
      } else {
        return resolve(JSON.parse(JSON.stringify(hacks)));
      }
    }).catch(function (error) {
      reject(resObj.databaseError(error));
      const input = {
        limit,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_SEARCH, input, error));
    });
  });
};



// get list of content grouped by category
exports.getListByCategory = function (cid, offset, limit, sort, details) {
  if (offset == null) { offset = 0; }
  if (limit == null) { limit = 30; }
  if (sort == null) { sort = -1; }
  if (details == null) { details = '-__v'; }
  return new Promise(function (resolve, reject) {
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (offset > 0) {
      offset = offset - 1;
    }

    details = details.split(',').join(' ');
    //  Content.aggregate([
    //         {
    //           $lookup: {
    //             from: 'categories',
    //             localField: "category",
    //             foreignField: "_id",
    //             as: 'category'
    //           }
    //         },
    //         {$match: {"category.cid": eval(cid)}},
    //         {$skip: offset * limit },
    //         {$limit:eval(limit)},
    //         {$sort: {createdAt: eval(sort)}}
    //       ])
    //       .exec((error,results) ->
    //         if error is null
    //           resolve JSON.parse(JSON.stringify(results))
    //         else
    //           log.o.e error
    //           # reject require('../response/resObj').databaseError(error)
    //           reject resObj.databaseError(error)
    //         input =
    //           cid: cid
    //           offset: offset
    //           limit: limit
    //           details: details
    //         Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_LIST_BY_CATEGORY, input, error))
    //     )
    return Content.find({ "category.cid": cid }).select(details).skip(offset * limit).limit(limit).sort({
      "createdAt": sort
    }).then(function (hacks) {
      if (hacks === null) {
        return resolve(null);
      } else {
        return resolve(JSON.parse(JSON.stringify(hacks)));
      }
    }).catch(function (error) {
      reject(resObj.databaseError(error));
      const input = {
        cid,
        offset,
        limit,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_LIST_BY_CATEGORY, input, error));
    });
  });
};

// get list of content grouped by category after an _id
exports.getListByCategoryAfterId = function (id, cid, offset, limit, sort, details) {
  if (offset == null) { offset = 0; }
  if (limit == null) { limit = 30; }
  if (sort == null) { sort = -1; }
  if (details == null) { details = '-__v'; }
  return new Promise(function (resolve, reject) {
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (offset > 0) {
      offset = offset - 1;
    }

    details = details.split(',').join(' ');
    //  Content.aggregate([
    //         {
    //           $lookup: {
    //             from: 'categories',
    //             localField: "category",
    //             foreignField: "_id",
    //             as: 'category'
    //           }
    //         },
    //         {$match: {"category.cid": eval(cid),"category._id":{$gt:id}}},
    //         {$skip: offset * limit },
    //         {$limit:eval(limit)},
    //         {$sort: {createdAt: eval(sort)}}
    //       ])
    //       .exec((error,results) ->
    //         if error is null
    //           resolve JSON.parse(JSON.stringify(results))
    //         else
    //           log.o.e error
    //           # reject require('../response/resObj').databaseError(error)
    //           reject resObj.databaseError(error)
    //         input =
    //           cid: cid
    //           offset: offset
    //           limit: limit
    //           details: details
    //         Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_LIST_BY_CATEGORY, input, error))
    //     )
    return Content.find({
      "category.cid": cid, "_id": { $gt: id }
    }).select(details).skip(offset * limit).limit(limit).sort({
      "createdAt": sort
    }).then(function (hacks) {
      if (hacks === null) {
        return resolve(null);
      } else {
        return resolve(JSON.parse(JSON.stringify(hacks)));
      }
    }).catch(function (error) {
      reject(resObj.databaseError(error));
      const input = {
        cid,
        offset,
        limit,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_LIST_BY_CATEGORY, input, error));
    });
  });
};

// get list of content sorted by date
exports.getListSortedByDate = function (offset, limit, sort, details) {
  if (offset == null) { offset = 0; }
  if (limit == null) { limit = 30; }
  if (sort == null) { sort = -1; }
  if (details == null) { details = '-__v'; }
  return new Promise(function (resolve, reject) {
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (offset > 0) {
      offset = offset - 1;
    }

    details = details.split(',').join(' ');

    return Content.find().select(details).skip(offset * limit).limit(limit).sort({
      "createdAt": sort
    }).then(async (hacks) => {
      if (hacks === null) {
        return resolve(null);
      } else {
        // await fs.writeFile("./upvotes.json", JSON.stringify(hacks,null,2), 'utf8', function (err) {
        //         if (err) {
        //             return console.log(err);
        //         }
        //         console.log("The file was saved!");
        //     }); 
        return resolve(JSON.parse(JSON.stringify(hacks)));
      }
    }).catch(function (error) {
      reject(resObj.databaseError(error));
      const input = {
        offset,
        limit,
        details
      };
      return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_SORT_BY_DATE, input, error));
    });
  });
};

// get list of content after an HID sorted by date
exports.getListAfterId = function ({ condition = 'gt', id, offset = 0, limit = 30, details = "-__v" }) {
  // if (details == null) { details = '-__v'; }
  return new Promise(function (resolve, reject) {
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (offset > 0) {
      offset = offset - 1;
    }

    details = details.split(',').join(' ');
    var obj = {}, sort;

    id = mongoose.Types.ObjectId(id);

    if (condition && condition === 'lt') {
      obj = { $lt: id };
      sort = -1;
    } else {
      obj = { $gt: id };
      sort = 1;
    }

    return Content.find({ "_id": obj })
      .select(details)
      .skip(offset * limit)
      .limit(limit)
      .sort({
        "_id": sort
      })
      .then(function (hacks) {
        if (hacks === null) {
          return resolve(null);
        } else {
          return resolve(JSON.parse(JSON.stringify(hacks)));
        }
      }).catch(function (error) {
        reject(resObj.databaseError(error));
        const input = {
          id,
          offset,
          limit,
          details
        };
        return Log.errors.database(logHandler.dataLogError(C.LOG_CONTENT_LIST_AFTER_ID, input, error));
      });
  });
};