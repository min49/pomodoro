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
  return user.id;
};

// TODO: Error Handle with id is not ObjectId
users.statics.deserializeForPassport = function (id) {
  return this.findById(id);
};

// TODO: Error Handle findOne()
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