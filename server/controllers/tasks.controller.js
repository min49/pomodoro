const Tasks = require('../models/tasks');

exports.getTasks = async function (req, res) {
  const {userId} = req.query;
  const tasksOfUser = await Tasks.getTasksOfUser(userId);
  res.json(tasksOfUser);
};

// TODO: validate req.body
exports.addTask = async function (req, res) {
  await Tasks.addTask(req.body);
  res.status(201).json({status: 'success'});
};