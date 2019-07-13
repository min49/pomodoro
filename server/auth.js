const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = require('./models/users');

module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, callback) => {
    callback(null, Users.serializeForPassport(user));
  });

  passport.deserializeUser((id, callback) => {
    callback(null, Users.deserializeForPassport(id));
  });

  passport.use(new LocalStrategy(
    async function (username, password, done) {
      try {
        const user = await Users.login(username, password);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
};