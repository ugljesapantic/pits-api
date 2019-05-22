// UserHandler.js

const connectToDatabase = require('../db');
const Dairy = require('./Dairy');
const {successResponse, errorResponse} = require('./../utls/http.utils');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const s3 = new AWS.S3();

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

module.exports.create = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    return connectToDatabase()
        .then(createDairy.bind(this, getUserId(event), event.body, callback))
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

const createErrorResponse = (statusCode, message) => ({
    statusCode: statusCode || 501,
    headers: { 'Content-Type': 'text/plain' },
    body: message,
  });

 function getUserId(event) {
    return event.requestContext.authorizer.principalId;
 }

 function getDairies(id, date) {
  return Dairy.find({user_id: id, date})
    .then(dairies => dairies)
    .catch(err => Promise.reject(new Error(err)));
}

function createDairy(id, bodyJson, callback) {
    const body = JSON.parse(bodyJson);
    if(body.type === 'text') {
        return Dairy.create({
            user_id: id,
            ...body
        })
          .then(dairy => dairy)
          .catch(err => Promise.reject(new Error(err)));
    } else {
        const base64Data = body.content.replace(/^data:application\/octet-stream;base64,/,"");
        const binaryData = Buffer.alloc(base64Data, 'base64');
        const name = uuid.v1();
        return s3.putObject({
            Bucket: 'pits-dairy',
            Key: `${name}.webm`,
            Body: binaryData,
            ContentType: 'audio/webm',
            ACL: 'public-read',
          }).promise().then(() => {
            return Dairy.create({
                user_id: id,
                ...body,
                content: `https://s3.eu-central-1.amazonaws.com/pits-dairy/${name}.webm`
            })
              .then(dairy => dairy)
              .catch(err => Promise.reject(new Error(err)));
          }).catch(() => {
              callback(null, createErrorResponse(500, 'Fail'))
          })
    }
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
