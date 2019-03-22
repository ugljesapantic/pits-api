// UserHandler.js

const connectToDatabase = require('../db');
const Clipboard = require('./Clipboard');
const {successResponse, errorResponse} = require('./../utls/http.utils');

/**
 * Functions
 */

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(getClipboards.bind(this, getUserId(event)))
    .then(successResponse)
    .catch(errorResponse);
};

module.exports.create = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(createClipboard.bind(this, getUserId(event), event.body))
        .then(successResponse)
        .catch(errorResponse);
  };

  module.exports.update = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const {id} = event.pathParameters;
    const filter = {"_id": id};
    return connectToDatabase()
        .then(update.bind(this, filter, JSON.parse(event.body)))
        .then(successResponse)
        .catch(errorResponse);
  };



  module.exports.updateItem = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const {id, item_id} = event.pathParameters;
    const filter = {"_id": id, "items._id": item_id};
    return connectToDatabase()
        .then(updateItem.bind(this, filter, JSON.parse(event.body)))
        .then(successResponse)
        .catch(errorResponse);
  };

  module.exports.deleteItem = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const {id, item_id} = event.pathParameters;
    const filter = {"_id": id, "items._id": item_id};
    return connectToDatabase()
        .then(deleteItem.bind(this, filter))
        .then(successResponse)
        .catch(errorResponse);
  };

//   unify error handling jbt, also the success
  module.exports.addItem = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const {id} = event.pathParameters;
    const filter = {"_id": id};
    return connectToDatabase()
        .then(addItem.bind(this, filter, JSON.parse(event.body)))
        .then(successResponse)
        .catch(errorResponse);
  };

  module.exports.deleteAll = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(deleteAllClipboards.bind(this, getUserId(event)))
        .then(successResponse)
        .catch(errorResponse);
  };

  module.exports.remove = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const filter = {user_id: getUserId(event), _id: event.pathParameters.id}
    return connectToDatabase()
        .then(remove.bind(this, filter))
        .then(successResponse)
        .catch(errorResponse);
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

  function update(filter, body) {
    return Clipboard.findOneAndUpdate(
        filter, 
        {$set: body},
        {new: true});
}


  function deleteItem(filter) {
    return Clipboard.findOneAndUpdate(
        filter, 
        {$pull: {items: {_id: filter["items._id"]}}});
}

  function addItem(filter, body) {
    return Clipboard.findOneAndUpdate(
        filter, 
        {$push: {"items": body}},
        {new: true}).then(doc =>  doc.items[doc.items.length - 1])
  };

  function deleteAllClipboards(id) {
    return Clipboard.deleteMany({
        user_id: id,
    }).catch(err => Promise.reject(new Error(err)));
  }

  function remove(filter) {
    return Clipboard.deleteOne(filter).catch(err => Promise.reject(new Error(err)));
  }