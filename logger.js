var api = {};
api.fs = require('fs');

var levels = {
  1: "info",
  2: "warn",
  3: "error"
};

var fromConfig = "./logger.log";

var writeStream = api.fs.createWriteStream(fromConfig, {flags: 'r+'});
formLog(levels[1], "Server started!", function(log){
  writeStream.write(JSON.stringify(log) + "\n");
  console.log(log.message);
});

function logRequest(req){
  var message = "request: method - " + req.method + " | url - " + req.url;
  formLog(levels[1], message, function(log){
    writeStream.write(JSON.stringify(log) + "\n");
    console.log(log.message);
  });
}

function logResponse(res){
  var message = "response : res.code - " + res.statusCode + "| res.sendDate - " + res.sendDate;
  formLog(levels[1], message, function(log){
    writeStream.write(JSON.stringify(log) + "\n");
    console.log(log.message);
  });
}

function logError(err){
  var message = "error: " + err.toString();
  formLog(levels[3], message, function(log){
    writeStream.write(JSON.stringify(log) + "\n");
    console.log(log.message);
  });
}

function logData(name, data){
  var message = name + " : " + JSON.stringify(data);
  formLog(levels[1], message, function(log){
    writeStream.write(JSON.stringify(log) + "\n");
    console.log(log.message);
  });
}

function formLog(level, message, callback) {
  var log = {};
  log.level = level;
  log.message = message;
  log.timestamp = new Date().toString();
  callback(log);
}

module.exports = {
  logResponse: logResponse,
  logRequest: logRequest,
  logError: logError,
  logData: logData,
};
