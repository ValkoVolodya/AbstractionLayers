var api = {};
api.fs = require('fs');
api.cookies = require('./cookies');
api.logger = require('./logger');
api.cashe = require('./cashe');
api.config = require('./config');

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
    //divide the buiseness logic
    //or no? do I want one more callback?
    var obj = JSON.parse(data);
    obj.birth = new Date(obj.birth);
    var difference = new Date() - obj.birth;
    obj.age = Math.floor(difference / 31536000000);
    delete obj.birth;
    var data = JSON.stringify(obj);

    api.cashe.put(req.url, data, api.config.expireTime);
    api.logger.logData("Data from person Handler", data);
    var head = null;
    callback(200, head, data);
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
    api.cashe.put(req.url, data, expireTime);
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
