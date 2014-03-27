var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);

var database = process.env.MONGO_URL || 'mongodb://localhost/test';

mongoose.connect(database);

module.exports = db;