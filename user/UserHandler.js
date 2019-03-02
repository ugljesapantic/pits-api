// UserHandler.js
const connectToDatabase = require('../db');
const User = require('./User');
const successResponse = require('./../utls/http.utils');

/**
 * Functions
 */

module.exports.getUsers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(getUsers)
    .then(successResponse)
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: err.message })
    }));
};

/**
 * Helpers
 */

 function getUsers() {
  return User.find({})
    .then(users => users)
    .catch(err => Promise.reject(new Error(err)));
}
