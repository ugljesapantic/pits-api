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

  module.exports.updateItem = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const {id, item_id} = event.pathParameters;
    const filter = {"_id": id, "items._id": item_id};
    return connectToDatabase()
        .then(updateItem.bind(this, filter, JSON.parse(event.body)))
        .then(item => ({
            statusCode: 200,
            body: JSON.stringify(item)
        }))
        .catch(err => ({
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ message: err.message })
        }));
  };

  module.exports.deleteAll = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(deleteAllClipboards.bind(this, getUserId(event)))
        .then(() => ({
            statusCode: 200,
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
        ...JSON.parse(body)
    })
      .then(clipboard => clipboard)
      .catch(err => Promise.reject(new Error(err)));
  }

//   SOME ERROR HANDLIN

  function updateItem(filter, body) {
      return Clipboard.findOneAndUpdate(
          filter, 
          {$set: {"items.$.value": body.value,"items.$.title": body.title}},
          {new: true}).then(doc =>  doc.items.id(filter["items._id"]));
  }

  function deleteAllClipboards(id) {
    return Clipboard.deleteMany({
        user_id: id,
    }).catch(err => Promise.reject(new Error(err)));
  }