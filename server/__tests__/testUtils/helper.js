const {Users} = require('../../models/users');
const {Tasks} = require('../../models/tasks');
const {Sessions} = require('../../models/sessions');

exports.setupTestData = async function (data) {
  for (let u of data) {
    const {username, password, tasks} = u;
    const user = await Users.add(username, password);
    u.id = user.id;

    for (let t of tasks) {
      const {name, focusTime, relaxTime, sessions} = t;
      const task = await Tasks.add({name, focusTime, relaxTime, userId: user.id});
      t.id = task.id;

      if (sessions) {
        for (let s of sessions) {
          const session = await Sessions.add(
            {...s, taskId: task.id, userId: user.id});
          s.id = session.id;
        }
      }
    }
  }
};