const express = require('express');
const router = express.Router();
const passport = require('passport');
const {validationResult} = require('express-validator');
const request = require('request');

const config = require('../config');
const ValidatorGenerator = require('./utils/ValidatorGenerator');
const {sessionsSchemaObj} = require('../models/sessions');
const {tasksSchemaObj} = require('../models/tasks');
const {usersSchemaObj} = require('../models/users');

const tasksController = require('../controllers/tasks.controller');
const usersController = require('../controllers/users.controller');
const sessionsController = require('../controllers/sessions.controller');

router.get('/tasks', ensureAuthenticated, tasksController.getTasks);
router.post('/tasks/new',
  ensureAuthenticated,
  ValidatorGenerator.forSchema(tasksSchemaObj, ['name', 'focusTime', 'relaxTime']),
  ensureValidRequest,
  tasksController.addTask);
router.patch('/tasks/edit',
  ensureAuthenticated,
  ValidatorGenerator.forSchema(tasksSchemaObj, [{_id: 'taskId'}, 'name', 'focusTime', 'relaxTime']),
  ensureValidRequest,
  tasksController.editTask);
router.delete('/tasks/delete',
  ensureAuthenticated,
  ValidatorGenerator.forSchema(tasksSchemaObj, [{_id: 'taskId'}]),
  ensureValidRequest,
  tasksController.deleteTask);

router.get('/sessions', ensureAuthenticated, sessionsController.getSessions);
router.post('/sessions/start',
  ensureAuthenticated,
  ValidatorGenerator.forSchema(sessionsSchemaObj, ['duration']),
  ValidatorGenerator.forSchema(tasksSchemaObj, [{name: 'taskName'}]),
  ensureValidRequest,
  sessionsController.addSession);
router.patch('/sessions/stop',
  ensureAuthenticated,
  ValidatorGenerator.forSchema(sessionsSchemaObj, [{_id: 'sessionId'}]),
  // use SchemaType spec of 'duration' for 'remainingTime' because they are expected to be the same
  ValidatorGenerator.forOneField(ValidatorGenerator.required, 'remainingTime', sessionsSchemaObj.duration),
  ensureValidRequest,
  sessionsController.stopSession);
router.patch('/sessions/finish',
  ensureAuthenticated,
  ValidatorGenerator.forSchema(sessionsSchemaObj, [{_id: 'sessionId'}]),
  ensureValidRequest,
  sessionsController.finishSession);

router.get('/users/current', usersController.getLoggedInUser);
router.post('/users/register',
  checkRecaptcha,
  ValidatorGenerator.forSchema(usersSchemaObj, ['username', 'password']),
  ensureValidRequest,
  usersController.registerUser,
  passport.authenticate('local'),
  usersController.loginSuccess);
router.patch('/users/changepassword',
  ensureAuthenticated,
  ValidatorGenerator.forSchema(usersSchemaObj, [{password: 'currentPassword'}, {password: 'newPassword'}]),
  ensureValidRequest,
  usersController.changePassword);

router.post('/login',
  checkRecaptcha,
  ValidatorGenerator.forSchema(usersSchemaObj, ['username', 'password']),
  ensureValidRequest,
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

function ensureValidRequest(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  } else {
    return res.status(422).json({
      errorMessage: 'Invalid request.',
      errors: errors.array()
    });
  }
}

function checkRecaptcha(req, res, next) {
  if (!req.body['g-recaptcha-response']) {
    return res.status(422).json({errorMessage: 'reCaptcha validation failed.'});
  }

  let recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?`;
  recaptchaUrl += `secret=${config.RECAPTCHA_SECRET}&`;
  recaptchaUrl += `response=${req.body['g-recaptcha-response']}&`;
  recaptchaUrl += `remoteip=${req.connection.remoteAddress}`;
  request.post(recaptchaUrl, (error, response, body) => {
    const result = JSON.parse(body);
    if (result.success) {
      next();
    } else {
      return res.status(422).json({
        errorMessage: 'reCaptcha validation failed:',
        response: result
      });
    }
  });
}

module.exports = router;