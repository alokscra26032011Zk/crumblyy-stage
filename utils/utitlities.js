/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';
/**
  Create by Saksham on 9th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 26 - recent - toJSONSync
*/
const C = require('./constants');

/**
 * Hashing a data
 * @param data
 * @returns {*}
 */
exports.md5 = function(data) {
  const md5 = require('md5');
  return md5(data);
};

/**
 * Fetching type of a data
 * @param data
 * @returns {string}
 */
exports.typeOf = function(data) {
  const stringConstructor = 'test'.constructor;
  const arrayConstructor = [].constructor;
  const objectConstructor = {}.constructor;
  if (data === null) {
    return C.NULL;
  } else if (data === undefined) {
    return C.UNDEFINED;
  } else if (data.constructor === stringConstructor) {
    return C.STRING;
  } else if (data.constructor === arrayConstructor) {
    return C.ARRAY;
  } else if (data.constructor === objectConstructor) {
    return C.OBJECT;
  } else {
    return C.UNKNOWN;
  }
};

/**
 * Converting an array to object with initial value
 * @param array
 * @returns {{}}
 */
exports.arrayToObject = function(array, value) {
  const object = {};
  let i = 0;
  while (i < array.length) {
    object[array[i]] = value;
    i++;
  }
  return object;
};

/**
 * converting data to JSON - just for error catching
 * @param data
 */
exports.toJSON = data =>
  new Promise(function(resolve,reject){
    try {
      data = JSON.parse(data);
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  })
;

// convert to json sync
exports.toJSONSync = data => JSON.parse(data);
