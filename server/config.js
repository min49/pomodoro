require('dotenv').config(); // Read env variables from .env file

exports.MONGODB_URI = process.env.MONGODB_URI;
exports.SESSION_SECRET = process.env.SESSION_SECRET;