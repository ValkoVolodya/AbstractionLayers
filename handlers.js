var api = {};
api.fs = require('fs');
api.cookies = require('./cookies');
api.logger = require('./logger');
api.cashe = require('./cashe');
api.methods = require('./method');
api.config = require('./config');

//questions:
//how use buffers now, if I have send via cb
//how to prettify code

function personHandler(req, res, callback) {
  api.methods.getOrPost[req.method](req, res, callback);
};

function ipHandler(req, res, callback) {
  var head = {
    'Set-Cookie': 'mycookie-test',
    'Content-Type': 'text/html'
  };
  var code = 200;
  //divide the buiseness logic
  var ip = req.connection.remoteAddress;
  data = '<h1>Welcome</h1>Your IP: ' + ip;
  api.cookies.parseCookies(req, function(cookies) {
    data += '<pre>' + JSON.stringify(cookies) + '</pre>';
  });
  callback(code, head, data);
};

function nameHandler(req, res, callback){
  //this code dublicates
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
    var obj = JSON.parse(data);
    var data = JSON.stringify(obj.name);

    api.cashe.put(req.url, data, api.config.expireTime);
    api.logger.logData("Data from person Handler", data);
    var head = null;
    callback(200, head, data);
  });
}

function ageHandler(req, res, callback){
  //this code dublicates
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
    var obj = JSON.parse(data);
    obj.birth = new Date(obj.birth);
    var difference = new Date() - obj.birth;
    obj.age = Math.floor(difference / 31536000000);
    delete obj.birth;
    var data = JSON.stringify(obj.age);

    api.cashe.put(req.url, data, api.config.expireTime);
    api.logger.logData("Data from person Handler", data);
    var head = null;
    callback(200, head, data);
  });
}

module.exports = {
  ipHandler: ipHandler,
  personHandler: personHandler,
  nameHandler: nameHandler,
  ageHandler: ageHandler
}
