var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require('sqlite3');

// const db = new sqlite3.Database("database.db", sqlite3.OPEN_READWRITE, err => {
//   if (err) {
//       console.error(err);
//   }
// })

const { Pool } = require('pg');
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "c21db",
  password: "234wersdf",
  port: 5432,
});

var indexRouter = require('./routes/index')(db);
var usersRouter = require('./routes/users');
var todosRouter = require('./routes/todos')(db);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todos', todosRouter);

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
