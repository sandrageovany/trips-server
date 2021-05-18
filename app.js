require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const cors= require('cors');

//Include passport config
require('./configs/passport');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(
  `${app_name}:${path.basename(__filename).split('.')[0]}`
);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('trust proxy', 1); //allows heroku to receive connaction from other websites
//Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      sameSite: true, //the client and the server are on the same domain (Localhost)
      secure: false, //not using https
      httpOnly: true,
      maxAge: 600000000, //expiration time in millisecond
    },
    rolling: true, //session gets refreshed in the user is active
  })
);

//Initialize PAssport
app.use(passport.initialize());
//Connect Passport to the session
app.use(passport.session());

// Express View engine setup

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use(cors({
  credentials: true,
  origin: [process.env.CLIENT_HOSTNAME],
}))

const index = require('./routes/index');
app.use('/', index);

const itinerary = require('./routes/itinerary-routes');
app.use('/api', itinerary);

const auth = require('./routes/auth-routes');
app.use('/api', auth);

module.exports = app;
