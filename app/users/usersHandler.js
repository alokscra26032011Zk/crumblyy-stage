
/**
  Create by Saksham on 11th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 13 - recent - working with end client (POST/GET)
  Saksham - 2018 04 24 - recent - fetch self with UID
  Saksham - 2018 05 03 - recent - post handler user
  Saksham - 2018 05 05 - recent - update user
  Saksham - 2018 05 08 - recent - google web auth
  Saksham - 2018 05 14 - recent - user login
*/
const shortid = require('shortid');
const { OAuth2Client } = require('google-auth-library');
const usersCtrl = require('./usersController');
const sendErrResp = require('../response/errorResponse');
const sendSuccResp = require('../response/successResponse');
const resObj = require('../response/resObj');
const timeHandler = require('../../utils/timeHandler');
const tokenHandler = require('../../utils/tokenHandler');
const encrypt = require('../../utils/encrypt');
const eCodes = require('../../utils/errorCodes');
const C = require('../../utils/constants');

const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);

/*
---------- PRIVATE -----------
------------------------------
*/

//creating a new user
const create = (req, permissions) =>
  new Promise(function (resolve, reject) {
    req.body.permissions = permissions;

    if (req.body.email) {
      if (req.body.password) {
        return encrypt.hash(req.body.password, 8).then(function (hash) {
          req.body.password = hash;
          return usersCtrl.create(req.body).then(function (user) {
            req.body.password = undefined; //removing the hash from request body
            return resolve(user);
            //catch for usersCtrl
          }).catch(error1 => reject(error1));
          //catch for encrypt hash
        }).catch(error => reject(error));
        //else for if password given
      } else {
        return usersCtrl.create(req.body).then(user => resolve(user)).catch(error => reject(error));
      }
      //else for if email provided
    } else {
      return reject(resObj.missingBodyParameters('kindly provide [email] body parameter'));
    }
  })
  ;

// create a new handler (user)
const createHandler = req =>
  new Promise(function (resolve, reject) {
    if (req.body.permissions) {

      try {
        let error = false;
        req.body.permissions = JSON.parse(req.body.permissions);
        // checking if user has permission that it is providing
        for (let permission of Array.from(req.body.permissions)) {
          if (req.user.permissions.indexOf(permission) === -1) {
            reject(resObj.accessDenied(`not eligible to provide [${permission}] to the new user`));
            error = true;
            break;
          }
        }

        if (error === false) {
          // calling create function to insert user
          req.body.permissions.push(C.SELF);
          req.body.permissions.push(C.HANDLER);
          return create(req, req.body.permissions).then(user => resolve(user)).catch(error => reject(error));
        }
      } catch (error1) {
        return reject(resObj.malformed('Cast to Array failed for [permissions]'));
      }


      // else for if permissions parameter is present
    } else {
      return reject(resObj.missingBodyParameters('kindly provide [permissions] body parameter'));
    }
  })
  ;

// google authentication
const googleAuth = req =>
  new Promise(function (resolve, reject) {
    if (req.get(C.GOOGLE_TOKEN)) {
      return client.verifyIdToken({
        idToken: req.get(C.GOOGLE_TOKEN),
        audience: process.env.GOOGLE_AUTH_CLIENT_ID
      }).then(function (ticket) {
        var payload;
        payload = ticket.getPayload();
        return usersCtrl.findUserWithGID(payload.sub, payload.email).then(function (user) {
          return resolve({
            new: false,
            user: user
          });
        }).catch(function (error) {
          if (error.errorCode && error.errorCode === 611) {
            req.body.gid = payload.sub;
            req.body.name = payload.name;
            req.body.dp = payload.picture || null;
            req.body.verified = payload.email_verified;
            req.body.email = payload.email;
            return create(req, [C.END_CLIENT, C.SELF]).then(function (user) {
              return resolve({
                new: true,
                user: user
              });
              // catch for create user
            }).catch(function (error1) {
              return reject(error1);
            });
          } else {
            return reject(error);
          }
        });
        // catch for client verifyIdToken
      }).catch(function (error) {
        log.e(error);
        if (error.message.includes('Token used too late')) {
          return reject(resObj.googleAuthError(eCodes.GOOGLE_AUTH_ERROR_TOKEN_EXPIRED, '[google-token] already expired, kindly refresh'));
        } else {
          return reject(resObj.googleAuthError(eCodes.GOOGLE_AUTH_ERROR, error.message));
        }
      });
    } else {
      return reject(resObj.missingHeaders('kindly provide [google-token] header'));
    }
  });


// login a user
const userEmailLogin = req =>
  new Promise(function (resolve, reject) {
    if (req.body.email) {
      if (req.body.password) {
        return usersCtrl.findUserWithEmail(req.body.email).then(function (user) {
          if (user.password !== null) {
            return encrypt.compare(req.body.password, user.password).then(function (condition) {
              if (condition === true) {
                return resolve(user);
              } else {
                return reject(resObj.userError('incorrect [password] provided.'));
              }
              // catch for encrypt compare
            }).catch(error1 => reject(error1));
            // else for if password is null
          } else {
            return reject(resObj.userError('[password] not exist. This happens if earlier signed up with google/facebook OAuth.'));
          }
          // catch for find user with email
        }).catch(error => reject(error));
      } else {
        return reject(resObj.missingBodyParameters('kindly provide [password] body parameter'));
      }
    } else {
      return reject(resObj.missingBodyParameters('kindly provide [email] body parameter'));
    }
  })
  ;

// login a user
const userEmailLoginAnonymously = req =>
  new Promise(function (resolve, reject) {
    usersCtrl.create({
      email: require('uuid/v4')(),
      permissions: [
        "END-CLIENT",
        "SELF"
      ]
    })
      .then((user) => {
        return resolve(user)
      })
      .catch(error => { reject(error) })
  })
  ;

// get user auth methods
const authMethods = req =>
  new Promise(function (resolve, reject) {
    return usersCtrl.findUserWithEmail(req.query.email).then(function (user) {
      const methods = [];
      user = JSON.parse(JSON.stringify(user));

      if (user.password && (user.password !== null)) {
        methods.push(C.EMAIL_AUTH);
      }
      if (user.gid && (user.gid !== null)) {
        methods.push(C.GOOGLE_AUTH);
      }

      return resolve(methods);
    }).catch(error => reject(error));
  })
  ;


/*
---------- EXPORTS -----------
------------------------------
*/

// create a end client
exports.postEndClient = function (req, resp) {
  const permissions = [C.END_CLIENT, C.SELF];

  return create(req, permissions).then(details =>
    tokenHandler.generateC(details.uid).then(token => sendSuccResp.userSignUp(req, resp, token, details)).catch(error1 => sendErrResp.normalError(req, resp, error1))
  ).catch(error => sendErrResp.normalError(req, resp, error));
};

// create platform handler
exports.postHandler = (req, resp) =>
  createHandler(req).then(details =>
    tokenHandler.generateA(details.uid).then(token => sendSuccResp.userSignUp(req, resp, token, details)).catch(error1 => sendErrResp.normalError(req, resp, error1))
  ).catch(error => sendErrResp.normalError(req, resp, error))
  ;

// read user (self)
exports.getSelf = (req, resp) =>
  usersCtrl.getUid(req.get(C.UID)).then(function (user) {
    delete user.password;
    return sendSuccResp.generalObject(req, resp, user);
  }).catch(error => sendErrResp.normalError(req, resp, error))
  ;

// update user
exports.updateSelf = (req, resp) =>
  usersCtrl.update(req.get(C.UID), req.body).then(function (user) {
    delete user.password;
    return sendSuccResp.generalObject(req, resp, user);
  }).catch(error => sendErrResp.normalError(req, resp, error))
  ;



// create an end client (google auth)
exports.postEndClientGoogle = (req, resp) =>
  googleAuth(req).then(userObj =>
    tokenHandler.generateC(userObj.user.uid).then(function (token) {
      if (userObj.new === true) {
        return sendSuccResp.userSignUp(req, resp, token, userObj.user);
      } else {
        return sendSuccResp.userSignIn(req, resp, token, userObj.user);
      }
      // catch for token generate
    }).catch(error1 => sendErrResp.normalError(req, resp, error1))
    // catch for google auth
  ).catch(error => sendErrResp.normalError(req, resp, error))
  ;


// login a user
exports.userEmailLogin = (req, resp) =>
  userEmailLogin(req).then(function (user) {
    if (user.permissions.indexOf(C.END_CLIENT) > -1) {
      return tokenHandler.generateC(user.uid).then(token => sendSuccResp.userSignIn(req, resp, token, user));
    } else {
      return tokenHandler.generateA(user.uid).then(token => sendSuccResp.userSignIn(req, resp, token, user));
    }
    // catch for user email login fn
  }).catch(error => sendErrResp.normalError(req, resp, error))
  ;

// login a user anonymously
exports.userEmailLoginAnonymously = (req, resp) => {
  userEmailLoginAnonymously(req).then(function (user) {
    if (user.permissions.indexOf(C.END_CLIENT) > -1) {
      return tokenHandler.generateC(user.uid).then(token => sendSuccResp.userSignUp(req, resp, token, user));
    }
    // catch for user email login fn
  }).catch(error => {
    sendErrResp.normalError(req, resp, error)
  })
    ;
}

// get various auth methods of a user
exports.userAuthMethods = (req, resp) =>
  authMethods(req).then(methods => sendSuccResp.generalObject(req, resp, methods)).catch(error => sendErrResp.normalError(req, resp, error))
  ;

//get user bookmarks
exports.getBookmarks = (req, resp) =>
  usersCtrl.getBookmarks(req.get(C.UID))
    .then(function (bookmarks) {
      return sendSuccResp.generalObjectCount(req, resp, bookmarks);
    }).catch(error => sendErrResp.normalError(req, resp, error))
  ;

//get user bookmarks sorted by date
exports.getAllBookmarks = (req, resp) =>
  usersCtrl.getAllBookmarks(req.get(C.UID))
    .then(function (bookmarks) {
      return sendSuccResp.generalObjectCount(req, resp, bookmarks);
    }).catch(error => sendErrResp.normalError(req, resp, error))
  ;
// update bookmarks
exports.updateBookmarks = (req, resp) =>
usersCtrl.updateBookmarks(req.get(C.UID), req.body).then(function (user) {
  delete user.password;
  return sendSuccResp.generalObject(req, resp, {});
}).catch(error => sendErrResp.normalError(req, resp, error))
;
// update upvotes
exports.updateUpvotes = (req, resp) =>
usersCtrl.updateUpvotes(req.get(C.UID), req.body).then(function (user) {
  delete user.password;
  return sendSuccResp.generalObject(req, resp, {});
}).catch(error => sendErrResp.normalError(req, resp, error))
;
// update shares
exports.updateShares = (req, resp) =>
usersCtrl.updateShares(req.get(C.UID), req.body).then(function (user) {
  delete user.password;
  return sendSuccResp.generalObject(req, resp, {});
}).catch(error => sendErrResp.normalError(req, resp, error))
;

// get personalized recommendations
exports.getPersonalizedRecommendations = (req, resp) =>
usersCtrl.getPersonalizedRecommendations(req.get(C.UID), req.body).then(function (temp) {
  return sendSuccResp.generalObject(req, resp, temp);
}).catch(error => sendErrResp.normalError(req, resp, error))
;