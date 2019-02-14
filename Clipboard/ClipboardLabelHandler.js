

const connectToDatabase = require('../db');
const ClipboardLabel = require('./ClipboardLabel');

/**
 * Functions
 */

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(getClipboardLabels.bind(this, getUserId(event)))
    .then(labels => ({
        statusCode: 200,
        body: JSON.stringify(labels)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: err.message })
    }));
};

module.exports.create = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(createClipboardLabel.bind(this, getUserId(event), event.body))
        .then(label => ({
            statusCode: 200,
            body: JSON.stringify(label)
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

 function getClipboardLabels(id) {
  return ClipboardLabel.find({user_id: id})
    .then(labels => labels)
    .catch(err => Promise.reject(new Error(err)));
}

function createClipboardLabel(id, body) {
    return ClipboardLabel.create({
        user_id: id,
        ...JSON.parse(body)
    })
      .then(label => label)
      .catch(err => Promise.reject(new Error(err)));
  }

  function deleteAllClipboards(id) {
    return ClipboardLabel.deleteMany({
        user_id: id,
    }).catch(err => Promise.reject(new Error(err)));
  }