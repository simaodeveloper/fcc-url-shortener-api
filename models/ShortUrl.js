const mongoose = require('mongoose');
const dns = require('dns');

let shortUrlIncrement = 0;

const ShortUrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  shorturl: Number
});

ShortUrlSchema.pre('save', function (next) {
  if (!(/https?:\/\//g.test(this.url))) {
    return next(new Error('invalid URL'));
  }

  this.shorturl = ++shortUrlIncrement;
  next();
});

module.exports = mongoose.model('ShortUrl', ShortUrlSchema);
