const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const config = require('./config');
const {Users} = require('./models/users');

module.exports = function (app) {
  // app.use(session(..)) must be called before passport
  app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, callback) => {
    callback(null, Users.serializeForPassport(user));
  });

  passport.deserializeUser((id, callback) => {
    Users.deserializeForPassport(id)
      .then(user => callback(null, user));
  });

  passport.use(new LocalStrategy(
    function (username, password, done) {
      Users.login(username, password)
        .then(user => done(null, user))
        .catch(err => done(err));
    }
  ));
};