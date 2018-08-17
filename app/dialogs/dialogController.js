/*

/*
crumblyy-backend
dialogController

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-06-14 by Saksham
@note Updates :
*/
const { Dialog } = require('./dialogModel');

// create a new dialog entry
exports.create = details =>
  new Promise(function(resolve, reject) {
    return Dialog.create(details).then(dialog=> resolve(JSON.parse(JSON.stringify(dialog)))).catch(error => reject(error));
  })
;

// get a recent dialog
exports.recent = () =>
  new Promise(function(resolve, reject){
    return Dialog.findOne({}).sort({createdAt: -1}).limit(1).then(function(dialog){
      if (dialog === null) {
        return resolve(null);
      } else {
        return resolve(JSON.parse(JSON.stringify(dialog)));
      }
    }).catch(error => reject(error));
  })
;
