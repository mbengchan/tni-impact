var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const arabicRouter = require("./routes/arabic");
const bengaliRouter = require('./routes/bengali');
const cantoneseRouter = require('./routes/cantonese');
const filipinoRouter = require('./routes/filipino');
const frenchRouter = require('./routes/french');
const germanRouter = require('./routes/german');
const gujaratiRouter = require("./routes/gujarati");
const hausaRouter = require("./routes/hausa");
const hindiRouter = require("./routes/hindi");
const igboRouter = require("./routes/igbo");
const indexRouter = require('./routes/index');
const indonesianRouter = require('./routes/indonesian');
const italianRouter = require('./routes/italian');
const japaneseRouter = require('./routes/japanese');
const kinyarwandaRouter = require('./routes/kinyarwanda');
const malagasyRouter = require('./routes/malagasy');
const malayRouter = require('./routes/malay');
const mandarinRouter = require('./routes/mandarin');
const marathiRouter = require('./routes/marathi');
const mongolianRouter = require('./routes/mongolian');
const myanmarRouter = require('./routes/myanmar');
const nepaliRouter = require('./routes/nepali');
const portugueseRouter = require('./routes/portuguese');
const punjabiRouter = require('./routes/punjabi');
const russianRouter = require('./routes/russian');
const shonaRouter = require('./routes/shona');
const spanishRouter = require('./routes/spanish');
const swahiliRouter = require('./routes/swahili');
const swedishRouter = require('./routes/swedish');
const tamilRouter = require('./routes/tamil');
const teluguRouter = require('./routes/telugu');
const turkeyRouter = require('./routes/turkey');
const urduRouter = require('./routes/urdu');
const vietnameseRouter = require('./routes/vietnamese');
const yorubaRouter = require('./routes/yoruba');
const zuluRouter = require('./routes/zulu');
const dutchRouter = require('./routes/dutch');
const finnishRouter = require('./routes/finnish');
const greekRouter = require('./routes/greek');
const norwegianRouter = require('./routes/norwegian');

// New Regstration Routes
const registerRouter = require('./routes/register');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://reg.tniglobal.org',
      'https://reg.tniglobal.org'
  ],
  credentials: true
}));

app.use('/', indexRouter);
app.use('/arabic', arabicRouter);
app.use('/bengali', bengaliRouter);
app.use('/cantonese', cantoneseRouter);
app.use('/filipino', filipinoRouter);
app.use('/french', frenchRouter);
app.use('/german', germanRouter);
app.use('/gujarati', gujaratiRouter);
app.use('/hausa', hausaRouter);
app.use('/hindi', hindiRouter);
app.use('/igbo', igboRouter);
app.use('/indonesian', indonesianRouter);
app.use('/italian', italianRouter);
app.use('/japanese', japaneseRouter);
app.use('/kinyarwanda', kinyarwandaRouter);
app.use('/malagasy', malagasyRouter);
app.use('/malay', malayRouter);
app.use('/mandarin', mandarinRouter);
app.use('/marathi', marathiRouter);
app.use('/mongolian', mongolianRouter);
app.use('/myanmar', myanmarRouter);
app.use('/nepali', nepaliRouter);
app.use('/portuguese', portugueseRouter);
app.use('/punjabi', punjabiRouter);
app.use('/russian', russianRouter);
app.use('/shona', shonaRouter);
app.use('/spanish', spanishRouter);
app.use('/swahili', swahiliRouter);
app.use('/swedish', swedishRouter);
app.use('/tamil', tamilRouter);
app.use('/telugu', teluguRouter);
app.use('/turkish', turkeyRouter);
app.use('/urdu', urduRouter);
app.use('/vietnamese', vietnameseRouter);
app.use('/yoruba', yorubaRouter);
app.use('/zulu', zuluRouter);
app.use('/dutch', dutchRouter);
app.use('/finnish', finnishRouter);
app.use('/greek', greekRouter);
app.use('/norwegian', norwegianRouter);

// Register New Registration Routes
app.use('/api/register', registerRouter);

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
