const express = require('express');
const router = express.Router();
const passport = require('passport');

const tasksController = require('../controllers/tasks.controller');
const usersController = require('../controllers/users.controller');

router.get('/tasks', ensureAuthenticated, tasksController.getTasks);
router.post('/tasks/new', ensureAuthenticated, tasksController.addTask);

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/'}),
  usersController.loginSuccess);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;