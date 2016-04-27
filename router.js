handlers = require("./handlers");

var routing = {
  '/': handlers.ipHandler,
  '/person': handlers.personHandler,
  '/person/name': handlers.nameHandler,
  '/person/age': handlers.ageHandler
};

module.exports.routing = routing;
