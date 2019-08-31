const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  return await bcrypt.compare(password, user.password)
    .then(function (res) {
      if (res) {
        return user;
      } else {
        return false;
      }
    });
};

users.statics.add = async function (username, password) {
  const user = await this.findOne({username});
  if (user) {
    throw new Error('Username already exists.');
  } else {
    const User = this;
    return await bcrypt.genSalt(10)
      .then(function (salt) {
        return bcrypt.hash(password, salt)
      }).then(function (hash) {
        return new User({username, password: hash}).save();
      }).catch(function (err) {
        throw err;
      });
  }
};

module.exports = mongoose.model('Users', users);