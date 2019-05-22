const mongoose = require('mongoose');
let isConnected;

module.exports = () => {
  if (isConnected) {
    return Promise.resolve();
  }

  return mongoose
    .connect(process.env.DB) // keep the connection string in an env var
    .then(db => {
      isConnected = db.connections[0].readyState;
    });
};
