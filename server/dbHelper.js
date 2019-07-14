const mongoose = require('mongoose');
const config = require('./config');

function connect() {
  const opts = {
    useNewUrlParser: true,
    useFindAndModify: false, // for deprecated error in mongoose
    useCreateIndex: true
  };
  mongoose.connect(config.MONGODB_URI, opts);
  mongoose.Promise = global.Promise;
  mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));
}

module.exports = {connect};