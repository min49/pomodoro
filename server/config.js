/*
 * require('dotenv').config(); called in app.js to read .env file to process.env
 */

exports.MONGODB_URI = process.env.MONGODB_URI;
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.ORIGIN = process.env.ORIGIN;