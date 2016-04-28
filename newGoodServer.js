var api = {};
api.http = require('http'),
api.fs = require('fs');
api.router = require('./router')
api.logger = require('./logger');
api.config = require('./config');
api.types = require('./types');

api.http.createServer(function (req, res) {
  api.logger.logRequest(req);
  var data = api.router.routing[req.url];
  api.types.typesArr[typeof(data)](data, req, res, function(code, head, data) {
    res.writeHead(code, head);
    res.end(data);
    api.logger.logResponse(res);
  });
}).listen(api.config.port);
