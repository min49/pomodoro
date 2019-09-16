const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const usersSchemaObj = {
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
};
const users = new Schema(usersSchemaObj);

users.statics.serializeForPassport = function (user) {
  return user.id;
};

// TODO: Error Handle with id is not ObjectId
users.statics.deserializeForPassport = function (id) {
  return this.findById(id);
};

// TODO: Error Handle findOne()
users.statics.login = async function (username, password) {
  const user = await this.findOne({
    username: {
      $regex: new RegExp(`^${username}$`, 'i')
    }
  });
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
  const user = await this.findOne({
    username: {
      $regex: new RegExp(`^${username}$`, 'i')
    }
  });
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

users.statics.changePassword = async function (userId, currentPassword, newPassword) {
  // get User by userId
  const user = await this.findOne({_id: userId});
  if (user) {
    const res = await bcrypt.compare(currentPassword, user.password);
    if (res) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      return true;
    } else {
      return false;
    }
  } else {
    throw new Error('User not found');
  }
};

exports.usersSchemaObj = usersSchemaObj;
exports.Users = mongoose.model('Users', users);