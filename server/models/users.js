const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const users = new Schema({
  username: {
    type: String,
    max: 20,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

users.statics.serializeForPassport = function (user) {
  return user._id;
};

users.statics.deserializeForPassport = function (id) {
  return this.findById(id);
};

users.statics.login = async function (username, password) {
  const user = await this.findOne({username});
  if (!user) {
    return false;
  }
  if (password === user.password) {
    return user;
  } else {
    return false;
  }
};

module.exports = mongoose.model('Users', users);