const {Sessions} = require('../models/sessions');
const {Tasks} = require('../models/tasks');
const {validationResult} = require('express-validator');

exports.getSessions = async function (req, res) {
  const userId = req.user.id;
  const sessions = await Sessions.getSessionsOfUser(userId);
  res.json(sessions);
};

exports.addSession = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const
    userId = req.user.id,
    {taskName, duration} = req.body,
    taskId = await Tasks.getId(userId, taskName),
    startDatetime = new Date(),
    isCompleted = false;

  const savedSession = await Sessions.add({
    taskId,
    startDatetime,
    duration,
    isCompleted,
    userId
  });
  res.status(201).json(savedSession);
};

exports.stopSession = async function (req, res) {
  const
    userId = req.user.id,
    {sessionId, remainingTime} = req.body;

  const session = await Sessions.getSession(sessionId, userId);
  session.duration -= remainingTime;
  await session.save();
  res.status(200).json(session);
};

exports.finishSession = async function (req, res) {
  const
    userId = req.user.id,
    {sessionId} = req.body;

  const session = await Sessions.getSession(sessionId, userId);
  session.isCompleted = true;
  await session.save();
  res.status(200).json(session);
};