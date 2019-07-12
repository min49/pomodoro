const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const tasks = new Schema({
  userId: {
    type: String, // TODO: Schema.Types.ObjectId,
    require: true
  },
  name: {
    type: String,
    max: 50,
    require: true
  },
  focusTime: {
    type: Number,
    require: true
  },
  relaxTime: {
    type: Number,
    require: true
  }
});

tasks.statics.getTasksOfUser = async function (userId) {
  return this.find({userId}).exec();
};

tasks.statics.addTask = async function (obj) {
  await new this(obj).save();
};

module.exports = mongoose.model('Tasks', tasks);