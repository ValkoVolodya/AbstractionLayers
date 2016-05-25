var api = {};
api.fs = require('fs');
api.cookies = require('./cookies');
api.logger = require('./logger');
api.cashe = require('./cashe');
api.config = require('./config');
api.parse = require('./parseObject');

function getPersonHandler(req, res, callback) {
  //this code dublicates in name and age handlers
  var dataFromCashe = api.cashe.get(req.url);
  if (dataFromCashe){
    api.logger.logData("Get from cashe", dataFromCashe)
    var head = null;
    callback(200, head, dataFromCashe);
  }
  api.fs.readFile('./person.json', function(err, data) {
    if (err){
      api.logger.logError(err);
      throw err;
    }
    api.parse.parseObject(data, function(obj){
      api.cashe.put(req.url, obj, api.config.expireTime);
      api.logger.logData("Data from person Handler", obj);
      var head = null;
      callback(200, head, obj);
    });
  });
};

function postPersonHandler(req, res, callback){
  // Receiving POST data
  var body = [];
  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    var data = Buffer.concat(body).toString();
    var obj = JSON.parse(data);
    if (obj.name) obj.name = obj.name.trim();
    data = JSON.stringify(obj);
    api.logger.logData("From post request", data);
    api.cashe.put(req.url, data, api.config.expireTime);
    api.fs.writeFile('./person.json', data, function(err) {
      if (!err) {
        api.logger.logData("File Saved!", data);
        head = null;
        data = "File Saved";
        callback(200, head, data);
      } else {
        api.logger.logError(err);
        head = null;
        data = "Write Error";
        callback(500, head, data);
      }
    });
  });
}

module.exports = {
  getPersonHandler: getPersonHandler,
  postPersonHandler: postPersonHandler
}
