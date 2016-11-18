var express = require('express');
var router = express.Router();

var firebase = require("firebase");

router.post('/', function(req, res, next) {
    var db = firebase.database();
    var refProcedures = db.ref("results/" + req.body.id);
    refProcedures.once("value", function(snapshot) {
        if (snapshot.exists()) {
            var text = snapshot.val().text;
            var r = {
                result : text
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(r));
        } else {
            res.status(404);
            res.send('Result with id = ' + req.body.id + " not found");
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        res.status(404);
        res.send('Result with id = ' + req.body.id + " not found");
    });
});

module.exports = router;
