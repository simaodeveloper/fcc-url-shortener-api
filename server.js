'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var ShortUrl = require('./models/ShortUrl');

var cors = require('cors');

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint...
app.post("/api/shorturl/new", async function (req, res) {
  const location = await ShortUrl.create(req.body);

  res.json({
    "original_url": location.url,
    "short_url": location.shorturl
  });
});

app.get("/api/shorturl/:id", async function (req, res, next) {

  const location = await ShortUrl.findOne({ shorturl: req.params.id });

  if (!location) {
    return next(new Error('invalid URL'));
  }

  res.redirect(location.url);
});

// Error Handler
app.use(async function (err, req, res, next) {
  res.json({
    error: err.message
  })
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
