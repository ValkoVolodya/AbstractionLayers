var types = {
  object: function(o) { return JSON.stringify(o); },
  string: function(s) { return s; },
  undefined: function() { return 'not found'; },
  function: function(fn, req, res, callback) { return fn(req, res, callback) + ''; },
};

module.exports.typesArr = types;
