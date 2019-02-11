// UserHandler.js

const connectToDatabase = require('../db');
const Clipboard = require('./Clipboard');

/**
 * Functions
 */

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(getClipboards.bind(this, getUserId(event)))
    .then(clipboards => ({
        statusCode: 200,
        body: JSON.stringify(clipboards)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: err.message })
    }));
};

module.exports.create = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log('content', event.body)
    return connectToDatabase()
        .then(createClipboard.bind(this, getUserId(event), event.body))
        .then(clipboard => ({
            statusCode: 200,
            body: JSON.stringify(clipboard)
        }))
        .catch(err => ({
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ message: err.message })
        }));
  };

/**
 * Helpers
 */

 function getUserId(event) {
     return event.requestContext.authorizer.principalId;
 }

 function getClipboards(id) {
  return Clipboard.find({user_id: id})
    .then(clipboards => clipboards)
    .catch(err => Promise.reject(new Error(err)));
}

function createClipboard(id, body) {
    return Clipboard.create({
        user_id: id,
        ...body
    })
      .then(clipboard => clipboard)
      .catch(err => Promise.reject(new Error(err)));
  }