const {Sessions} = require('../models/sessions');
const {Tasks} = require('../models/tasks');

exports.getTasks = async function (req, res) {
  const userId = req.user.id;
  const tasksOfUser = await Tasks.getTasksOfUser(userId);
  res.json(tasksOfUser);
};

exports.addTask = async function (req, res) {
  const {name, focusTime, relaxTime} = req.body;
  const task = {
    userId: req.user.id,
    name,
    focusTime,
    relaxTime
  };
  const savedTask = await Tasks.add(task);
  res.status(201).json(savedTask);
};

exports.editTask = async function (req, res) {
  const
    userId = req.user.id,
    {taskId, name, focusTime, relaxTime} = req.body;

  const task = await Tasks.getTask(taskId, userId);
  task.name = name;
  task.focusTime = focusTime;
  task.relaxTime = relaxTime;
  await task.save();
  res.status(200).json(task);
};

exports.deleteTask = async function (req, res) {
  const
    userId = req.user.id,
    {taskId} = req.body;

  const sessionsResult = await Sessions.deleteSessionsOfTask(taskId, userId);
  const taskResult = await Tasks.deleteTask(taskId, userId);
  res.status(200).json({
    taskDeletedCount: taskResult.deletedCount,
    sessionDeletedCount: sessionsResult.deletedCount
  });
};