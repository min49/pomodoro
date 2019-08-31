const Users = require('../models/users');

exports.loginSuccess = function (req, res) {
  res.status(200).json({
    status: 'logged in',
    username: req.body.username
  });
};

exports.getLoggedInUser = function (req, res) {
  if (req.isAuthenticated()) {
    return res.json({
      isLoggedIn: true,
      username: req.user.username
    });
  } else {
    return res.json({isLoggedIn: false});
  }
};

exports.registerUser = async function (req, res, next) {
  const {username, password} = req.body;
  try {
    await Users.add(username, password);
    next();
  } catch (err) {
    return res.status(400).json({errorMessage: err.message});
  }
};