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
*/
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const C = require('./constants');
const eCodes = require('./errorCodes');
const eTypes = require('./errorTypes');
const resObj = require('../app/response/resObj');
//Log = require '../logs/logger'
const mailOptions = {};
let transporter = undefined;

//logging to our smtp server
nodemailer.createTestAccount(() =>
  transporter = nodemailer.createTransport({
    host: C.ZOHO_SMTP,
    port: 465,
    secure: true,
    auth: {
      user: process.env.NO_REPLY_EMAIL,
      pass: process.env.NO_REPLY_PASSWORD
    }})
);