// UserHandler.js

const connectToDatabase = require('../db');
const Dairy = require('./Dairy');
const {successResponse, errorResponse} = require('./../utls/http.utils');

/**
 * Functions
 */

module.exports.getAll = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const {date} = event.queryStringParameters;
  return connectToDatabase()
    .then(getDairies.bind(this, getUserId(event), date))
    .then(successResponse)
    .catch(errorResponse);
};

module.exports.create = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(createDairy.bind(this, getUserId(event), event.body))
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

  module.exports.removeAll = (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(removeAllDairies.bind(this, getUserId(event)))
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

 function getDairies(id, date) {
  return Dairy.find({user_id: id, date})
    .then(dairies => dairies)
    .catch(err => Promise.reject(new Error(err)));
}

function createDairy(id, body) {
    return Dairy.create({
        user_id: id,
        ...JSON.parse(body)
    })
      .then(dairy => dairy)
      .catch(err => Promise.reject(new Error(err)));
  }

  function update(filter, body) {
    return Dairy.findOneAndUpdate(
        filter, 
        {$set: body},
        {new: true});
}

function remove(filter) {
    return Dairy.deleteOne(filter).catch(err => Promise.reject(new Error(err)));
}

function removeAllDairies(id) {
    return Clipboard.deleteMany({
        user_id: id,
    }).catch(err => Promise.reject(new Error(err)));
  }