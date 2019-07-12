const Tasks = require('../models/tasks');

exports.getTasks = async function(req, res) {
  const { userId } = req.query;
  const tasksOfUser = await Tasks.getTasksOfUser(userId);
  res.json(tasksOfUser);
};