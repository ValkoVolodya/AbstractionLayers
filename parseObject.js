var parseObject = function(data, callback){
  var obj = JSON.parse(data);
  obj.birth = new Date(obj.birth);
  var difference = new Date() - obj.birth;
  obj.age = Math.floor(difference / 31536000000);
  delete obj.birth;
  var data = JSON.stringify(obj);
  callback(data);
}

var parseName = function(data, callback){
  var obj = JSON.parse(data);
  var n = obj.name;
  callback(n);
}

var parseAge = function(data, callback){
  var obj = JSON.parse(data);
  obj.birth = new Date(obj.birth);
  var difference = new Date() - obj.birth;
  obj.age = Math.floor(difference / 31536000000);
  delete obj.birth;
  var a = obj.age;
  callback(a);
}

module.exports = {
  parseObject: parseObject,
  parseName: parseName,
  parseAge: parseAge
}
