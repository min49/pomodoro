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

exports.changePassword = async function (req, res) {
  const
    userId = req.user.id,
    {currentPassword, newPassword} = req.body;
  try {
    const result = await Users.changePassword(userId, currentPassword, newPassword);
    if (result) {
      return res.status(200).json({status: 'success'});
    } else {
      return res.status(200).json({status: 'failure', message: 'Incorrect Password.'});
    }
  } catch (err) {
    return res.status(500).json({errorMessage: 'There was an error. Please try again later.'});
  }
};