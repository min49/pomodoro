const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const tasks = new Schema({
  userId: {
    type: String, // TODO: Schema.Types.ObjectId,
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

tasks.statics.getTasksOfUser = async function (userId) {
  return this.find({userId}).exec();
};

tasks.statics.addTask = async function (obj) {
  await new this(obj).save();
};

module.exports = mongoose.model('Tasks', tasks);