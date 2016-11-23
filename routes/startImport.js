var express = require('express');
var firebase = require("firebase");
var XLSX = require("xlsx");
var moment = require('moment');
var fcommon = require('./../fcommon');

var router = express.Router();

var fs = require('fs');

var format = {columns:[]};

if (!fcommon.fileExists('./config/format.json')) {
    var fmt = process.env.FC_FORMAT;
    format = JSON.parse(fmt);
    fs.writeFile('./config/format.json', fmt, function(err) {
        if(err) {
            return console.log(err);
        }
    });
} else {
    format = JSON.parse(fs.readFileSync('./config/format.json', 'utf8'));
}


var Multer = require('multer');
var multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // no larger than 10mb
    }
});

router.post('/', multer.any(), function (req, res) {
    var id = Date.now();
    console.log("Start parse excel for id = " + id);
    var data = req.files[0].buffer;
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    res.send({id: id});
    var procMap = processExcel(bstr, id);
    if (procMap !== undefined) {
        writeToFirebase(procMap, id);
    }
});

function processExcel(dataArray, id) {
    var workbook;
    try {
        workbook = XLSX.read(dataArray, {type: 'binary'});
    } catch (err) {
        writeErrorResults(id, "Выбранный файл не является книгой MS Excel формата xlsx.")
        return undefined;
    }
    var sheet_name_list = workbook.SheetNames;
    var worksheet = workbook.Sheets[sheet_name_list[0]];
    if (!checkFileStructure(worksheet)) {
        writeErrorResults(id, "Выбранный файл содержит неверные данные о структуре.")
        return undefined;
    }
    var ln = 4;
    var procMap = [];
    do {
        var cellA = worksheet["A" + ln];
        if (cellA !== undefined) {
            var procId = cellA.w;
            var proc = {};
            proc.numberOfRowInPlan = procId;
            procMap[procId] = proc;
            var cell = worksheet["B" + ln];
            proc.auctionNumber = cell !== undefined ? cell.w: "";
            cell = worksheet["C" + ln];
            proc.subject = cell !== undefined ? cell.w: "";
            cell = worksheet["D" + ln];
            proc.firstMaxPriceWithTax = cell !== undefined ? cell.w: "";
            cell = worksheet["E" + ln];
            proc.proposalPriceWithTax = cell !== undefined ? cell.w: "";
            cell = worksheet["F" + ln];
            proc.publicationDate = cell !== undefined ? cell.w: "";
            cell = worksheet["G" + ln];
            proc.finishProposalsDateTime = cell !== undefined ? cell.w: "";
            cell = worksheet["H" + ln];
            proc.auctionDateTime = cell !== undefined ? cell.w: "";
            cell = worksheet["I" + ln];
            proc.resultsDateTime = cell !== undefined ? cell.w: "";
            cell = worksheet["J" + ln];
            proc.contractConclusionPlanDate = cell !== undefined ? cell.w: "";
            cell = worksheet["K" + ln];
            proc.contractExecutionPlanDate = cell !== undefined ? cell.w: "";
            cell = worksheet["L" + ln];
            proc.participants = cell !== undefined ? cell.w: "";
            cell = worksheet["M" + ln];
            proc.winner = cell !== undefined ? cell.w: "";
            cell = worksheet["N" + ln];
            proc.contractConclusionRealDate = cell !== undefined ? cell.w: "";
            cell = worksheet["O" + ln];
            proc.contractNumber = cell !== undefined ? cell.w: "";
            cell = worksheet["P" + ln];
            proc.contractPromissoryExecutionTerm = cell !== undefined ? cell.w: "";
            cell = worksheet["Q" + ln];
            proc.contractPaymentExecutionTerm = cell !== undefined ? cell.w: "";
            cell = worksheet["R" + ln];
            proc.actDateAndNumber = cell !== undefined ? cell.w: "";
            cell = worksheet["S" + ln];
            proc.paymentPromissoryTerm = cell !== undefined ? cell.w: "";
            cell = worksheet["T" + ln];
            proc.status = cell !== undefined ? cell.w: "";
            ln++;
        }
    } while (cellA !== undefined);
    console.log("Lines count = " + (ln - 4));
    return procMap;
}

var addRecords = 0;
var deleteRecords = 0;

function writeToFirebase(procMap, id){
    addRecords = 0;
    deleteRecords = 0;
    var db = firebase.database();
    var refProcedures = db.ref("procedures");
    for (var proc in procMap){
        refProcedures.child(proc).set(procMap[proc]);
        addRecords++;
    }
    refProcedures.once("value", function(snapshot) {
         var itemsProcessed = 0;
         snapshot.forEach(function(procSnapshot){
             if (typeof procMap[procSnapshot.val().numberOfRowInPlan] === 'undefined') {
                 refProcedures.child(procSnapshot.val().numberOfRowInPlan).remove();
                 deleteRecords++;
             }
             itemsProcessed++;
             if(itemsProcessed === snapshot.numChildren()) {
                 writeResults(id);
             }
         });
    });
    var cTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    var refLastImport = db.ref("lastImportDateTime");
    refLastImport.set(cTime);
}

function writeResults(id){
    console.log("Import finished, results wrote for id = " + id);
    var db = firebase.database();
    var refProcedures = db.ref("results");
    var textResult = "Добавленно/обновлено " + addRecords + " процедур. <br/>" +
            "Удалено " + deleteRecords + " процедур."

    refProcedures.child(id).set({text: textResult});
}

function writeErrorResults(id, text) {
    console.log("Import finished with error, results wrote for id = " + id);
    var db = firebase.database();
    var refProcedures = db.ref("results");
    refProcedures.child(id).set({text: text});
}

function checkFileStructure(worksheet) {
    const lit = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for(var i = 0; i < format.columns.length; i++){
        cell = worksheet[lit[i] + 1];
        var value = cell !== undefined ? cell.w: "";
        if (value !== format.columns[i]) {
            return false;
        }
    }
    return true;
}

module.exports = router;
