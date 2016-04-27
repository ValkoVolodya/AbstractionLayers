var api = {};
api.http = require('http'),
api.fs = require('fs');
api.router = require('./router')
api.logger = require('./logger');
api.config = require('./config');

var types = {
  object: function(o) { return JSON.stringify(o); },
  string: function(s) { return s; },
  undefined: function() { return 'not found'; },
  function: function(fn, req, res, callback) { return fn(req, res, callback) + ''; },
};

api.http.createServer(function (req, res) {
  api.logger.logRequest(req);
  var data = api.router.routing[req.url];
  types[typeof(data)](data, req, res, function(code, head, data) {
    res.writeHead(code, head);
    res.end(data);
    api.logger.logResponse(res);
  });
}).listen(api.config.port);
