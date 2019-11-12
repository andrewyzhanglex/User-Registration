var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var accountSchema = require('../models/accountSchema');
mongoose.connect('<addmongodbconnectionlink>', {useUnifiedTopology: true, useNewUrlParser: true});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  accountSchema.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    accountSchema.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', function(req, res) {
    res.render('auth');
  });
  app.get('/success', function(req, res) {
    res.send("Welcome "+req.query.username+"!!");
  });
  app.get('/error', function(req, res) {
    res.send("error logging in");
  });
  app.post('/', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/error',
  }));
}
