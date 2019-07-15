const Users = require('../../models/users');
const Tasks = require('../../models/tasks');
const Sessions = require('../../models/sessions');

exports.setupTestData = async function (data) {
  for (let {username, password, tasks} of data) {
    const user = await new Users({username, password}).save();

    for (let {name, focusTime, relaxTime, sessions} of tasks) {
      const task = await new Tasks(
        {name, focusTime, relaxTime, userId: user._id}).save();
    }
  }
};