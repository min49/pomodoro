'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const dbHelper = require('./dbHelper');
const pomodoroRouter = require('./routes/pomodoro.route');

const app = express();
dbHelper.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/pomodoro', pomodoroRouter);

module.exports = app;