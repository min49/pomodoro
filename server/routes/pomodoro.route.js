const express = require('express');
const router = express.Router();
const passport = require('passport');

const ValidatorGenerator = require('./utils/ValidatorGenerator');
const {sessionsSchemaObj} = require('../models/sessions');
const {tasksSchemaObj} = require('../models/tasks');

const tasksController = require('../controllers/tasks.controller');
const usersController = require('../controllers/users.controller');
const sessionsController = require('../controllers/sessions.controller');

router.get('/tasks', ensureAuthenticated, tasksController.getTasks);
router.post('/tasks/new', ensureAuthenticated, tasksController.addTask);
router.patch('/tasks/edit', ensureAuthenticated, tasksController.editTask);
router.delete('/tasks/delete', ensureAuthenticated, tasksController.deleteTask);

router.get('/sessions', ensureAuthenticated, sessionsController.getSessions);
router.post('/sessions/start',
  ensureAuthenticated,
  ValidatorGenerator.forSchema(sessionsSchemaObj, ['duration']),
  ValidatorGenerator.forSchema(tasksSchemaObj, [{name: 'taskName'}]),
  sessionsController.addSession);
router.patch('/sessions/stop', ensureAuthenticated, sessionsController.stopSession);
router.patch('/sessions/finish', ensureAuthenticated, sessionsController.finishSession);

router.get('/users/current', usersController.getLoggedInUser);
router.post('/users/register',
  usersController.registerUser,
  passport.authenticate('local'),
  usersController.loginSuccess);
router.patch('/users/changepassword', ensureAuthenticated, usersController.changePassword);

router.post('/login',
  passport.authenticate('local'),
  usersController.loginSuccess);
router.get('/logout', async function (req, res) {
  req.logout();
  res.status(200).json({status: 'logged out'});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;