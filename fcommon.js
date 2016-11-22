var fs = require('fs');

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}

exports.fileExists = fileExists;
