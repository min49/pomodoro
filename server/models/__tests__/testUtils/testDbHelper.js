const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

/**
 * Using sample code from mongodb-memory-server Github Readme
 */
class TestDbHelper {
  constructor() {
    this.mongoServer = new MongoMemoryServer();
    this.originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  }

  async start() {
    const mongoUri = await this.mongoServer.getConnectionString();
    const opts = {
      useNewUrlParser: true,
      useFindAndModify: false, // for deprecated error in mongoose
      useCreateIndex: true
    };
    try {
      await mongoose.connect(mongoUri, opts);
    } catch (err) {
      if (err) console.error(err);
    }
  }

  async stop() {
    await mongoose.disconnect(); // could get error on runs if not await
    await this.mongoServer.stop();
  }

  setOriginalTimeout() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = this.originalTimeout;
  }

  static setLongTimeoutForDb() {
    // May require additional time from downloading MongoDB binaries
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
  }

  static confirmDbIsLocal() {
    if (mongoose.connection.host !== '127.0.0.1'
      && mongoose.connection.host !== 'localhost') {
      throw new Error(`Test not on local MongoDB host, but on ${mongoose.connection.host}`)
    }
  }

  static async cleanup() {
    this.confirmDbIsLocal();

    const collections = await mongoose.connection.db.collections();
    return Promise.all(
      collections.map(collection => collection.drop())
    );
  }
}

module.exports = TestDbHelper;