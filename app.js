const express = require('express');
const router = express.Router();
const https = require('https')
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const sendmail = require('sendmail')();
// const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');
const browserSync = require('browser-sync');
const moment = require('moment');
const open = require('open');

// Routes
const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const componentsRouter = require('./routes/dashboard/components');
const incidentsRouter = require('./routes/dashboard/incidents');
const accountRouter = require('./routes/dashboard/account');
const rolesRouter = require('./routes/dashboard/roles');
const settingsRouter = require('./routes/dashboard/settings');
const usersRouter = require('./routes/dashboard/users');
const gendataRouter = require('./routes/dashboard/gendata');
const loginRouter = require('./routes/auth/login');
const forgot_passwordRouter = require('./routes/auth/forgot_password');
const setupRouter = require('./routes/setup');

var port = process.env.PORT || 3000;
const app = express();
app.listen(port, function () {
  console.log('App listening on port 3000');
  // open('http://localhost:' + port, {app: ['google chrome']});  
});

browserSync.init({
  files : './**/*',
  watchOptions : {
      ignored : 'node_modules/*',
      ignoreInitial : true
  }
});

app.use(require('connect-browser-sync')(browserSync, { injectHead: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(router);
app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/dashboard/components', componentsRouter);
app.use('/dashboard/incidents', incidentsRouter);
app.use('/dashboard/account', accountRouter);
app.use('/dashboard/roles', rolesRouter);
app.use('/dashboard/settings', settingsRouter);
app.use('/dashboard/users', usersRouter);
app.use('/dashboard/gendata', gendataRouter);
app.use('/auth/login', loginRouter);
app.use('/auth/forgot_password', forgot_passwordRouter);
app.use('/setup', setupRouter);

router.get('/auth/', function(req, res, next) {
  res.redirect('/auth/login/');
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;