
/*
crumblyy-backend
logHandler

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-17 by Saksham
@note Updates :
*/
const utils = require('../../utils/utitlities');
const C = require('../../utils/constants');

/*
------ EXPORTS -----
*/
exports.dataLogError = function(type, input, error = null){
  if (error !== null) {
    try {
      if (utils.typeOf(error) !== C.OBJECT) {
        error = JSON.parse(error);
      }

      return JSON.stringify({
        type,
        input,
        error
      });
    } catch (error1) {
      return `${type} :: ${JSON.stringify(input)} :: ${JSON.stringify(error)}`;
    }
  }
};