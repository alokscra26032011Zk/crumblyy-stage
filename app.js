
/**
  Create by Saksham on 9th April, 2018
  Last Active Branch - recent
  Saksham - 2018 04 13 - recent - adding morgan request logger
  Updates :
  Saksham - 2018 04 17 - recent - app.use content
  Saksham - 2018 04 27 - recent - app.use banners
  Saksham - 2018 05 02 - recent - app.use tags
  Saksham - 2018 05 02 - recent - app.use storage
  Saksham - 2018 05 21 - recent - app.use category
  Saksham - 2018 05 21 - recent - app.use topics
  Saksham - 2018 06 14 - recent - app.use dialogs
*/
const bodyParser = require('body-parser');
const express = require('express');
const resObj = require('./app/response/resObj');
const sendErrResp = require('./app/response/errorResponse');
const customMiddleware = require('./app/middleware/general');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(customMiddleware.reqLog);
app.use(customMiddleware.error);
app.use(customMiddleware.timeout);
app.set('view engine', 'ejs');

// handling routes internally in other files
app.use('/v2/users', require('./app/routes/users'));
app.use('/v2/contents', require('./app/routes/contents'));
app.use('/v2/banners', require('./app/routes/banners'));
app.use('/v2/tags', require('./app/routes/tags'));
app.use('/v2/files', require('./app/routes/storage'));
app.use('/v2/category', require('./app/routes/category'));
app.use('/v2/topics', require('./app/routes/topics'));
app.use('/v2/dialogs', require('./app/routes/dialogs'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// To normally ping & check if server is working
app.get('/ping', (req, resp) => resp.send({success: true}));

// All non available links
app.all('*', (req, resp) => sendErrResp.normalError(req, resp, resObj.notFound(req.method, req.originalUrl)));

/*
Exporting the app module
*/
exports.this = app;
