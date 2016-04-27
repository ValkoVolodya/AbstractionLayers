var api = {};
api.logger = require('./logger');

var cashe = {};

var put = function(key, value, time){

  if (typeof time !== 'undefined' &&
     (typeof time !== 'number' ||
      isNaN(time) ||
       time <= 0)){
    var err = new Error("Cashe timeout must be positive");
    api.logger.logError(err);
    throw err;
  }

  var oldRec = cashe[key];
  if (oldRec){
    clearInterval(oldRec.timeout);
  }

  var record = {
    value: value,
    expire: Date.now() + time
  }

  if(!isNaN(record.expire)){
    record.timeout = setTimeout(del, time);
  }

  cashe[key] = record;
}

var del = function(key){
  delete cashe[key];
}

var get = function(key) {
  var rec = cashe[key];
  if(typeof rec !== 'undefined'){
    if(isNaN(rec.expire) || rec.expire >= Date.now()){
      return rec.value;
    }
  }else{
    del(key);
  }
}

module.exports = {
  put: put,
  del: del,
  get: get
}
