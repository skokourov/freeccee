var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var summary = require('./routes/summary');
var startImport = require('./routes/startImport');
var getResult = require('./routes/getResult');

var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/summary', summary);
app.use('/startImport', startImport);
app.use('/getResult', getResult);

app.get('/', function (req, res) {
  res.status(200).sendFile(path.join(path.join(__dirname, 'public') + '/index.html'));
});


app.use('/public', express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
