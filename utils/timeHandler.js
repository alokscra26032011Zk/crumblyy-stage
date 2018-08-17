/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
'use strict';
/**
  Create by Saksham on 10th April, 2018
  Last Active Branch - recent
  Updates :
  Saksham - 2018 04 10 - recent - headers format, epoch time
  Saksham - 2018 05 08 - recent - milliToUTC & current time in milli
*/
const moment = require('moment');
const format = 'YYYY-MM-DD[T]HH:mm:ssZ';

// return current time in UTC
module.exports.currentUTC = () => moment().utc().format(format);


// convert given {param} to utc based time
module.exports.UTCFormattedTime = time => moment(time).utc().format(format);

// format time for headers
module.exports.formatTimeForHeaders = time => moment(time).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');

// add seconds to epoch time
exports.addSecondsToEpochTime = seconds => moment(seconds * 1000).utc().format(format);

// milliseconds to current utc
exports.milliToUTC = milli => moment(milli).utc().format(format);

// get current time in milliseconds
exports.currentMilli = () => moment().valueOf();

// current month in numbers
exports.currentMonthInNumber = () => moment().format('MM');

// current year
exports.currentYear = () => moment().format('YYYY');

// current date
exports.currentDate = () => moment().format('DD');

// format given string date to given format
exports.changeFormat = (date, format)=> moment(date).format(format);
