'use strict';
require('dotenv').config(); // Read env variables from .env file
const config = require('./config');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dbHelper = require('./dbHelper');
const pomodoroRouter = require('./routes/pomodoro.route');
const auth = require('./auth');

const app = express();
app.use(cors({credentials:true, origin: config.ORIGIN}));
dbHelper.connect();

auth(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/pomodoro', pomodoroRouter);

module.exports = app;