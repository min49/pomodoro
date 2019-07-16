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

sessions.statics.add = function (sessionObj) {
  return new this(sessionObj).save();
};

module.exports = mongoose.model('Sessions', sessions);