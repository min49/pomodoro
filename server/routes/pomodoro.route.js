const express = require('express');
const router = express.Router();
const passport = require('passport');

const tasksController = require('../controllers/tasks.controller');
const usersController = require('../controllers/users.controller');

router.get('/tasks', tasksController.getTasks);
router.post('/tasks/new', tasksController.addTask);

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/'}),
  usersController.loginSuccess);

module.exports = router;