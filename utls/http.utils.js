exports.successResponse =  (body) => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body)
})

exports.errorResponse = (err) => ({
  statusCode: err && err.statusCode || 500,
  headers: { 'Content-Type': 'text/plain' },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: err && err.message || ''
})