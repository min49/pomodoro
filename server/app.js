'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const config = require('./config');
const dbHelper = require('./dbHelper');
const pomodoroRouter = require('./routes/pomodoro.route');
const auth = require('./auth');

const app = express();
dbHelper.connect();
auth(app);

app.use(session({
  secret: config.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/pomodoro', pomodoroRouter);

module.exports = app;