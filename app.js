var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');


var firebase = require("firebase");

var summary = require('./routes/summary');
var startImport = require('./routes/startImport');
var getResult = require('./routes/getResult');

var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (!fileExists("./config/sa.json")) {
    var conf = process.env.FB_CONFIG;
    console.log("Firebase config:" + conf);
    fs.writeFile("./config/sa.json", conf, function(err) {
        if(err) {
            return console.log(err);
        } else {
            console.log("Firebase config file was created.");
            firebase.initializeApp({
                serviceAccount: "./config/sa.json",
                databaseURL: "https://freeccee.firebaseio.com"
            });
        }
    });
} else {
    console.log("Firebase config file exist.");
    firebase.initializeApp({
        serviceAccount: "./config/sa.json",
        databaseURL: "https://freeccee.firebaseio.com"
    });
}

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/summary', summary);
app.use('/startImport', startImport);
app.use('/getResult', getResult);

app.get('/', function (req, res) {
    res.status(200).sendFile(path.join(path.join(__dirname, 'public') + '/index.html'));
});


app.use('/public', express.static('public'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}

module.exports = app;
