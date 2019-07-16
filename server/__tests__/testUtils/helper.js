const Users = require('../../models/users');
const Tasks = require('../../models/tasks');
const Sessions = require('../../models/sessions');

exports.setupTestData = async function (data) {
  for (let u of data) {
    const {username, password, tasks} = u;
    const user = await new Users({username, password}).save();
    u.id = user.id;

    for (let t of tasks) {
      const {name, focusTime, relaxTime, sessions} = t;
      const task = await new Tasks(
        {name, focusTime, relaxTime, userId: user.id}).save();
      t.id = task.id;

      if (sessions) {
        for (let s of sessions) {
          const session = await new Sessions(
            {...s, taskId: task.id, userId: user.id}).save();
          s.id = session.id;
        }
      }
    }
  }
};