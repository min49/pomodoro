const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const tasks = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    max: 50,
    required: true
  },
  focusTime: {
    type: Number,
    required: true
  },
  relaxTime: {
    type: Number,
    required: true
  }
});

tasks.statics.getTasksOfUser = function (userId) {
  return this.find({userId});
};

tasks.statics.add = function (taskObj) {
  return new this(taskObj).save();
};

module.exports = mongoose.model('Tasks', tasks);