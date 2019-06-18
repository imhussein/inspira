module.exports = function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
};
