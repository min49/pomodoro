const Sessions = require('../models/sessions');
const Tasks = require('../models/tasks');

exports.addSession = async function (req, res) {
  const
    userId = req.user._id,
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