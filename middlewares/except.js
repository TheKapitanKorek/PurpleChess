module.exports = function(paths, middleware) {
  return function(req, res, next) {
    if (paths.indexOf(req.path) !== -1) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};
