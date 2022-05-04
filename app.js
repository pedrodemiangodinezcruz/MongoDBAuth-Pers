require('dotenv').config()
const path = require('path');

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('req-flash')

const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require('passport');
const auth = require('./routes/auth');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const biciRouter = require('./routes/bicicletas')
const reservaRouter = require('./routes/reservas')
const biciRouterAPI = require('./routes/api/bicicletas')
const usuariosAPIRouter = require('./routes/api/usuarios')

const usuariosRouter = require('./routes/usuarios')
const tokenRouter = require('./routes/token')

const app = express();

//Setup mongoose
const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_CONNECTION;

mongoose.connect(mongoDB, { useNewUrlParser: true })
mongoose.Promise = global.Promise
var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error: '))
db.on('open', console.log.bind(console, 'MongoDB connection ok '))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

// Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express sessions setup
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION,
    })
  })
)

app.use(flash())

/*  Passport setup
 we tell passport to use sessions to store serialized users,
*/
// app.use(passport.initialize());
// app.use(passport.session());
app.use(passport.authenticate('session'));

app.use('/', indexRouter);
app.use('/auth', auth);
app.use('/users', usersRouter);
app.use('/bicicletas', biciRouter);
app.use('/reservas', reservaRouter);
app.use('/api/bicicletas', biciRouterAPI);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
