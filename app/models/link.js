var mongoose = require('mongoose');
var crypto = require('crypto');

var urlSchema = new mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0}
});

urlSchema.methods.initialize = function () {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
};

module.exports = mongoose.model('Link', urlSchema);