const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dashboardRouter = require('./routes/dashhboard');
const usersRouter = require('./routes/users');
const tasksRouter = require('./backend-api/tasks');
const listsRouter = require('./backend-api/lists')
const frontListsRouter = require('./routes/lists')
const { restoreUser } = require('./auth');

const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('superSecret'));
app.use(express.static(path.join(__dirname,'public')));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: 'superSecret',
    store,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(restoreUser);
// create Session table if it doesn't already exist
store.sync();

app.use('/dashboard', dashboardRouter);
app.use(usersRouter);
app.use('/api/lists', listsRouter);
app.use('/api', tasksRouter);
app.use('/lists', frontListsRouter)

// Gets the splash page
app.get('/', (req,res) => {
  res.render('home', {
    title: "To Moo List"
  })
})

app.get('/team', (req,res) => {
  res.render('team', {
    title: "Dream Team"
  })
})

app.get('/upgrade', (req,res) => {
  res.render('upgrade', {
    title: "Upgrade"
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
