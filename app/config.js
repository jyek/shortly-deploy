var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);

// var database = process.env.PORT ? "mongodb://MongoLab-s:sbJm8VBzirDe47F8_juF86JjpQtXOFmgqhdEJaj9nDI-@ds030607.mongolab.com:30607/MongoLab-s" : 'mongodb://localhost/test';
var database = "mongodb://MongoLab-s:sbJm8VBzirDe47F8_juF86JjpQtXOFmgqhdEJaj9nDI-@ds030607.mongolab.com:30607/MongoLab-s";

mongoose.connect(database);

module.exports = db;
