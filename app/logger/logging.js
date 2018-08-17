
/*
crumblyy-backend
logging

@author Saksham
@note Last Branch Update - recent
     
@note Created on 2018-05-16 by Saksham
@note Updates :
  Saksham - 2018 05 21 - recent - resp changes
*/
const fs = require('fs');
const path = require('path');
const timeHandler = require('../../utils/timeHandler');
const shortid = require('shortid');
const mkdirp = require('mkdirp');
const C = require('../../utils/constants');

//------------ Private ---------------
//------------------------------------
const requestResponseObj = (req, resp) =>
  JSON.stringify({
    request: {
      headers: req.headers,
      query: req.query,
      params: req.params,
      body: req.body
    },
    response: {
      headers: resp.getHeaders(),
      status: resp.statusCode,
      body: resp.body
    }
  })
;

//------------ Objects ---------------
//------------------------------------
//object for mapping api functions
const api = {
  user: {
// saving user's requests & response & its response
    request(req, resp) {
      try {
        const userId = req.get(C.UID);
        const month = timeHandler.currentMonthInNumber();
        const year = timeHandler.currentYear();
        const date = timeHandler.currentDate();
        const current = timeHandler.changeFormat(timeHandler.currentUTC(), 'YYYYMMDD[T]HHmmss');
        const dir = `/${current}${`__${shortid.generate()}.txt`}`;

        const logPath = path.resolve(process.env.LOG_FOLDER) + `/requests/${year}/${month}/${date}`;
        const userLogPath = path.resolve(process.env.LOG_FOLDER) + `/users/${userId}/requests/${year}/${month}/${date}`;

        //saving to general logs
        mkdirp(logPath, function(err){
          let content;
          if (err) {
            log.e(err.toString());
          } else {
            content = requestResponseObj(req, resp);
          }

          // writing to file system
          return fs.writeFile(logPath + dir, content, function(err){
            if (err) {
              return log.e(err.toString());
            }
          });
        });

        //saving to user logs
        return mkdirp(userLogPath, function(err){
          if (err) {
            return log.e(err.toString());
          } else {
// writing to file system
            return fs.writeFile(userLogPath + dir, requestResponseObj(req, resp), function(err){
              if (err) {
                return log.e(err.toString());
              }
            });
          }
        });
      } catch (error) {
        return log.e(error);
      }
    },
// saving user's login requests & its response
    login(req, resp) {
      try {
        const userId = req.get(C.UID);
        const month = timeHandler.currentMonthInNumber();
        const year = timeHandler.currentYear();
        const date = timeHandler.currentDate();
        const current = timeHandler.changeFormat(timeHandler.currentUTC(), 'YYYYMMDD[T]HHmmss');
        const dir = `/${current}${`__${shortid.generate()}.txt`}`;

        const logPath = path.resolve(process.env.LOG_FOLDER) + `/requests/${year}/${month}/${date}`;
        const userLogPath = path.resolve(process.env.LOG_FOLDER) + `/users/${userId}/requests/${year}/${month}/${date}`;
        const userLoginLogPath = path.resolve(process.env.LOG_FOLDER) + `/users/${userId}/login/${year}/${month}/${date}`;

        //saving to general logs
        mkdirp(logPath, function(err){
          if (err) {
            return log.e(err.toString());
          } else {
// writing to file system
            return fs.writeFile(logPath + dir, requestResponseObj(req, resp), function(err){
              if (err) {
                return log.e(err.toString());
              }
            });
          }
        });

        //saving to user logs
        mkdirp(userLogPath, function(err){
          if (err) {
            return log.e(err.toString());
          } else {
// writing to file system
            return fs.writeFile(userLogPath + dir, requestResponseObj(req, resp), function(err){
              if (err) {
                return log.e(err.toString());
              }
            });
          }
        });

        //saving to user login logs
        return mkdirp(userLoginLogPath, function(err){
          if (err) {
            return log.e(err.toString());
          } else {
// writing to file system
            return fs.writeFile(userLoginLogPath + dir, requestResponseObj(req, resp), function(err){
              if (err) {
                return log.e(err.toString());
              }
            });
          }
        });
      } catch (error) {
        return log.e(error.toString());
      }
    },
// saving user's deleted objects
    deletes(uid, type, details) {
      try {
        const month = timeHandler.currentMonthInNumber();
        const year = timeHandler.currentYear();
        const date = timeHandler.currentDate();
        const current = timeHandler.changeFormat(timeHandler.currentUTC(), 'YYYYMMDD[T]HHmmss');
        const dir = `/${current}${`__${shortid.generate()}.txt`}`;

        const logPath = path.resolve(process.env.LOG_FOLDER) + `/deletes/${type}/${year}/${month}/${date}`;
        const userDeleteLogPath = path.resolve(process.env.LOG_FOLDER) + `/users/${uid}/deletes/${type}/${year}/${month}/${date}`;

        //saving to general logs
        mkdirp(logPath, function(err){
          if (err) {
            return log.e(err);
          } else {
// writing to file system
            return fs.writeFile(logPath + dir.replace('.txt', '') + `--${uid}--.txt`, details, function(err){
              if (err) {
                return log.e(err);
              }
            });
          }
        });

        //saving to user logs
        return mkdirp(userDeleteLogPath, function(err){
          if (err) {
            return log.e(err);
          } else {
// writing to file system
            return fs.writeFile(userDeleteLogPath + dir, details, function(err){
              if (err) {
                return log.e(err);
              }
            });
          }
        });

      } catch (error) {
        return log.e(error);
      }
    }
  },

//general requests & its response
  request(req, resp) {
    try {
      const month = timeHandler.currentMonthInNumber();
      const year = timeHandler.currentYear();
      const date = timeHandler.currentDate();
      const current = timeHandler.changeFormat(timeHandler.currentUTC(), 'YYYYMMDD[T]HHmmss');
      const dir = `/${current}${`__${shortid.generate()}.txt`}`;

      const logPath = path.resolve(process.env.LOG_FOLDER) + `/requests/${year}/${month}/${date}`;

      //saving to general logs
      return mkdirp(logPath, function(err){
        if (err) {
          return log.e(err);
        } else {
// writing to file system
          return fs.writeFile(logPath + dir, requestResponseObj(req, resp), function(err){
            if (err) {
              return log.e(err);
            }
          });
        }
      });
    } catch (error) {
      return log.e(error);
    }
  }
};

//errors for the platform
const errors = {
// database errors
  database(details) {
    try {
      const month = timeHandler.currentMonthInNumber();
      const year = timeHandler.currentYear();
      const date = timeHandler.currentDate();
      const current = timeHandler.changeFormat(timeHandler.currentUTC(), 'YYYYMMDD[T]HHmmss');
      const dir = `/${current}${`__${shortid.generate()}.txt`}`;

      const logPath = path.resolve(process.env.LOG_FOLDER) + `/errors/database/${year}/${month}/${date}`;

      //saving to general logs
      return mkdirp(logPath, function(err){
        if (err) {
          return log.e(err);
        } else {
// writing to file system
          return fs.writeFile(logPath + dir, details, function(err){
            if (err) {
              return log.e(err);
            }
          });
        }
      });
    } catch (error) {
      return log.e(error);
    }
  },
// mail errors
  mail(type, details) {
    try {
      const month = timeHandler.currentMonthInNumber();
      const year = timeHandler.currentYear();
      const date = timeHandler.currentDate();
      const current = timeHandler.changeFormat(timeHandler.currentUTC(), 'YYYYMMDD[T]HHmmss');
      const dir = `/${current}${`__${shortid.generate()}.txt`}`;

      const logPath = path.resolve(process.env.LOG_FOLDER) + `/errors/mail/${type}/${year}/${month}/${date}`;

      //saving to general logs
      return mkdirp(logPath, function(err){
        if (err) {
          return log.e(err);
        } else {
// writing to file system
          try {
            details = JSON.parse(details);
          } catch (error) {
            details = details.toString();
          }
          return fs.writeFile(logPath + dir, details, function(err){
            if (err) {
              return log.e(err);
            }
          });
        }
      });
    } catch (error1) {
      const error = error1;
      return log.e(error);
    }
  },

  library(type,details) {
    try {
      const month = timeHandler.currentMonthInNumber();
      const year = timeHandler.currentYear();
      const date = timeHandler.currentDate();
      const current = timeHandler.changeFormat(timeHandler.currentUTC(), 'YYYYMMDD[T]HHmmss');
      const dir = `/${current}${`__${shortid.generate()}.txt`}`;

      const logPath = path.resolve(process.env.LOG_FOLDER) + `/errors/library/${type}/${year}/${month}/${date}`;

      //saving to general logs
      return mkdirp(logPath, function(err){
        if (err) {
          return log.e(err);
        } else {
// writing to file system
          return fs.writeFile(logPath + dir, details, function(err){
            if (err) {
              return log.e(err);
            }
          });
        }
      });
    } catch (error) {
      return log.e(error);
    }
  },
//general errors
  general(type, details) {
    try {
      const month = timeHandler.currentMonthInNumber();
      const year = timeHandler.currentYear();
      const date = timeHandler.currentDate();
      const current = timeHandler.changeFormat(timeHandler.currentUTC(), 'YYYYMMDD[T]HHmmss');
      const dir = `/${current}${`__${shortid.generate()}.txt`}`;

      const logPath = path.resolve(process.env.LOG_FOLDER) + `/errors/${type}/${year}/${month}/${date}`;

      //saving to general logs
      return mkdirp(logPath, function(err){
        if (err) {
          return log.e(err);
        } else {
// writing to file system
          return fs.writeFile(logPath + dir, details, function(err){
            if (err) {
              return log.e(err);
            }
          });
        }
      });
    } catch (error) {
      return log.e(error);
    }
  }
};

// verbose logs
const verbose = function(type, details) {
  try {
    const month = timeHandler.currentMonthInNumber();
    const year = timeHandler.currentYear();
    const date = timeHandler.currentDate();
    const current = timeHandler.changeFormat(timeHandler.currentUTC(), 'YYYYMMDD[T]HHmmss');
    const dir = `/${current}${`__${shortid.generate()}.txt`}`;

    const logPath = path.resolve(process.env.LOG_FOLDER) + `/verbose/${type}/${year}/${month}/${date}`;

    //saving to general logs
    return mkdirp(logPath, function(err){
      if (err) {
        return log.e(err);
      } else {
// writing to file system
        return fs.writeFile(logPath + dir, details.toString(), function(err){
          if (err) {
            return log.e(err);
          }
        });
      }
    });
  } catch (error) {
    return log.e(error);
  }
};

// ---
// generated by js2coffee 2.2.0

//------------- Exports --------------
//------------------------------------
exports.api = api;
exports.errors = errors;
exports.verbose = verbose;