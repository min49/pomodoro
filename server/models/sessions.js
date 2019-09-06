const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const sessions = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  startDatetime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  isCompleted: {
    type: Boolean,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

// TODO: error handle DB calls

sessions.statics.getSessionsOfUser = function (userId) {
  return this.aggregate([
    {$match: {userId: new mongoose.Types.ObjectId(userId)}},
    {
      // Look up fields from 'Tasks' by 'taskId' (similar to join in SQL)
      // and return the result in the field named 'task'.
      $lookup: {
        from: 'tasks',
        let: {taskId: '$taskId'},
        pipeline: [
          // Filter other fields except 'Tasks.name' (and _id) in result -- 'task'
          {$match: {$expr: {$eq: ['$$taskId', '$_id']}}},
          {$project: {name: 1}}
        ],
        as: 'task'
      }
    },
    // 'task' results in an array
    // Unwind deconstructs it to give output with each element as separate record.
    // e.g. {a: 1, task: [2, 3]} => {a: 1, task: 2}, {a: 1, task: 3}
    // Here, task is expected to always be an array of one. So this just unwrap the array.
    {$unwind: '$task'}
  ]).exec();
};

sessions.statics.add = function (sessionObj) {
  return new this(sessionObj).save();
};

sessions.statics.getSession = function (sessionId, userId) {
  return this.findOne({_id: sessionId, userId});
};

sessions.statics.deleteSessionsOfTask = function (taskId, userId) {
  return this.deleteMany({taskId, userId});
};

module.exports = mongoose.model('Sessions', sessions);