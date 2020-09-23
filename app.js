var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const arabicRouter = require("./routes/arabic");
const bengaliRouter = require('./routes/bengali');
const cantoneseRouter = require('./routes/cantonese');
const filipinoRouter = require('./routes/filipino');
const frenchRouter = require('./routes/french');
const germanRouter = require('./routes/german');
const gujaratiRouter = require("./routes/gujarati");
const indexRouter = require('./routes/index');
const indonessiaRouter = require('./routes/indonessia');
const italianRouter = require('./routes/italian');
const japaneseRouter = require('./routes/japanese');
const malayRouter = require('./routes/malay');
const mandarinRouter = require('./routes/mandarin');
const mongolianRouter = require('./routes/mongolian');
const nepaliRouter = require('./routes/nepali');
const portugueseRouter = require('./routes/portuguese');
const russianeRouter = require('./routes/russian');
const spanishRouter = require('./routes/spanish');
const tamilRouter = require('./routes/tamil');
const urduRouter = require('./routes/urdu');
const vietnameseRouter = require('./routes/vietnamese');
const yorubaRouter = require('./routes/yoruba');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/arabic', arabicRouter);
app.use('/bengali', bengaliRouter);
app.use('/cantonese', cantoneseRouter);
app.use('/filipino', filipinoRouter);
app.use('/french', frenchRouter);
app.use('/german', germanRouter);
app.use('/gujarati', gujaratiRouter);
app.use('/idonessian', indonessiaRouter);
app.use('/italian', italianRouter);
app.use('/japanese', japaneseRouter);
app.use('/malay', malayRouter);
app.use('/mandarin', mandarinRouter);
app.use('/mongolian', mongolianRouter);
app.use('/nepali', nepaliRouter);
app.use('/portuguese', portugueseRouter);
app.use('/russian', russianeRouter);
app.use('/spanish', spanishRouter);
app.use('/tamil', tamilRouter);
app.use('/urdu', urduRouter);
app.use('/vietnamese', vietnameseRouter);
app.use('/yoruba', yorubaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
