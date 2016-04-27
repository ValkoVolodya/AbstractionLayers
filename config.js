var api = {};
api.fs = require('fs');
api.logger = require('./logger');

//default data
var expireTime = 3600 * 100;
var port = 2000;

api.fs.readFile('./config.json', function(err, data){
  if(!err){
    var obj = JSON.parse(data);
    if (checkNumber(obj.expireTime))
      expireTime = obj.expireTime;
    if (checkNumber(obj.port))
      port = obj.port;
  }else{
    api.logger.logError(err);
  }
});

var checkNumber = function(forCheck){
    return !(typeof forCheck == 'undefined' ||
             typeof forCheck !== 'number' ||
             isNaN(forCheck));
}

module.exports = {
  expireTime: expireTime,
  port: port
}
