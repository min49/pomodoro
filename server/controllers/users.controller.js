
exports.loginSuccess = function(req, res) {
  res.status(200).json({status: 'logged in'});
};

exports.getLoggedInUser = function(req, res) {
  if (req.isAuthenticated()) {
    return res.json({
      isLoggedIn: true,
      username: req.user.username
    });
  } else {
    return res.json({isLoggedIn: false});
  }
};