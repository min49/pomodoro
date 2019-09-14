'use strict';
require('dotenv').config(); // Read env variables from .env file
const path = require('path');
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

if (config.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => res.sendFile(
    path.join(__dirname, '../client/build', 'index.html')));
}

module.exports = app;