var express = require('express');
var router = express.Router();
var moment = require('moment');

var firebase = require("firebase");

var count;
var datetime;

firebase.initializeApp({
  serviceAccount: "./config/freeccee-9af37010c8a7.json",
  databaseURL: "https://freeccee.firebaseio.com"
});

router.get('/', function(req, res, next) {
  count = undefined;
  datetime = undefined;
  var db = firebase.database();
  var refProcedures = db.ref("procedures");
  res.writeHead(200, {'Content-Type': 'application/json'});
  refProcedures.once("value", function(snapshot) {
    count = snapshot.numChildren();
    applyResult(res);
  });
  var refLastImport = db.ref("lastImportDateTime");
  refLastImport.once("value", function (snapshot) {
    var val = snapshot.val();
    var cTime;
    if (val !== undefined) {
      cTime = moment(snapshot.val()).format("YYYY.MM.DD HH:mm:ss");
    } else {
      cTime = "Неизвестно";
    }
    datetime = cTime;
    applyResult(res);
  });
});

function applyResult(res){
  if (count !== undefined && datetime !== undefined) {
    var r = {
      datetime : datetime,
      count : count
    }
    res.end(JSON.stringify(r));
  }
}

module.exports = router;
