let middlewareObject = {};

middlewareObject.userNotLoggedIn = (req, res, next) => {
  if (!res.locals.isLoggedIn) {
    return next();
  }
  res.redirect("/");
};

middlewareObject.userIsLoggedIn = (req, res, next) => {
  if (res.locals.isLoggedIn) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObject;
