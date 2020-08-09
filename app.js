var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv').config()

var socketRouter = require('./routes/socketio');
var indexRouter = require('./routes/index');
var messageRouter = require('./routes/message');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/api', messageRouter)
app.io = socketRouter.io;

app.use(function(err, req, res, next) {
    console.error(err.statusCode); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
      // Return must always include the global fileds :
      // Field           Datatype        Default         Description             Examples
      // -----           --------        -------         -----------             --------
      // code            int             201             1xx, 2xx, 3xx, 5xx
      // description     string          Created         http code description
      // messages        array           Null            any type of messages
      // errors          array           Null            occured errors
      // warnings        array           Null            can be url format
      // datas           array/json      Null            results                 [ {Row 1}, {Row 2}, {Row 3}]
    res.status(err.statusCode).json({ status: err.statusCode, error: err, message: "Internal Server Error" });
    //res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
  });

module.exports = app;
