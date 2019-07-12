const mongoose = require('mongoose');
const config = require('./config');

function connect() {
  mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true});
  mongoose.Promise = global.Promise;
  mongoose.set('useFindAndModify', false);
  mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));
}

module.exports = {connect};