const Tasks = require('../models/tasks');

exports.getTasks = async function (req, res) {
  const userId = req.user.id;
  const tasksOfUser = await Tasks.getTasksOfUser(userId);
  res.json(tasksOfUser);
};

// TODO: validate req.body
exports.addTask = async function (req, res) {
  const task = {
    ...req.body,
    userId: req.user.id
  };
  const savedTask = await Tasks.add(task);
  res.status(201).json(savedTask);
};