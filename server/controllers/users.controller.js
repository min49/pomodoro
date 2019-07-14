
exports.loginSuccess = function(req, res) {
  res.status(200).json({status: 'logged in'});
};