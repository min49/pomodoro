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
  return this.find({userId});
};

sessions.statics.add = function (sessionObj) {
  return new this(sessionObj).save();
};

sessions.statics.getSession = function (sessionId, userId) {
  return this.findOne({_id: sessionId, userId});
};

module.exports = mongoose.model('Sessions', sessions);