var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var config = require('./config.json');
var app = express();

app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/*', function (req, res) {
  res.render('index.html');
});

app.listen(config.port);