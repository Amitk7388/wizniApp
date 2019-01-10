const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const connection = require('./config/connection');

var indexRouter = require('./routes/projects');
var usersRouter = require('./routes/employees');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(cookieParser());


app.use(indexRouter).databaseConnection;
app.use(usersRouter).databaseConnection;;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT || 3766

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}).listen(PORT, console.log('Port working on '+PORT));

module.exports = app;
