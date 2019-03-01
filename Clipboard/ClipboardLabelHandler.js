const connectToDatabase = require('../db');
const ClipboardLabel = require('./ClipboardLabel');
const Clipboard = require('./Clipboard');
const {successResponse, errorResponse} = require('./../utls/http.utils');

/**
 * Functions
 */

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(getClipboardLabels.bind(this, getUserId(event)))
    .then(successResponse)
    .catch(errorResponse);
};

module.exports.create = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(createClipboardLabel.bind(this, getUserId(event), event.body))
        .then(successResponse)
        .catch(errorResponse);
  };

  module.exports.delete = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const {id} = event.pathParameters;
    return connectToDatabase()
        .then(deleteClipboardLabel.bind(this, getUserId(event), id))
        .then(successResponse)
        .catch(errorResponse);
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

// todo  this must delete all the references from all the users i think , use pre hooks
  function deleteClipboardLabel(user_id, id) {
        return Clipboard.updateMany({
            user_id
        }, {$pull: {labels: id}}).then(() => {
        return ClipboardLabel.deleteOne({
            _id: id,
            user_id, user_id
        }).catch(err => Promise.reject(new Error(err)))
      });
  }