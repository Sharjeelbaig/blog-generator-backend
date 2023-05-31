var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors'); 
var indexRouter = require('./routes/index');
var generateRouter = require('./routes/generate');

var app = express();

const corsOptions = {
    origin: 'https://blog-generator-frontend.azurewebsites.net',
    optionsSuccessStatus: 200 // some legacy browsers (e.g., IE11) choke on 204
  };
  
app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/generate', generateRouter);

module.exports = app;



