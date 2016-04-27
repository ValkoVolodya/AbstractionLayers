var api = {};
api.handlers = require('./handlersByMethod');

var methods = {
  'GET': api.handlers.getPersonHandler,
  'POST': api.handlers.postPersonHandler
}

module.exports.getOrPost = methods;
