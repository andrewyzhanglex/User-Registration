var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var accountSchema = require('../models/accountSchema');
var bcrypt = require('bcrypt');
var session = require('express-session');

mongoose.connect('mongodblink', {useUnifiedTopology: true, useNewUrlParser: true});

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
      if (bcrypt.compareSync(password, user.password)) {
        //flash correct password or something.
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }
));

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: 
      { 
        secure: true,
        maxAge: 3600000,
      }
  }));
  //authentication portion.
  app.get('/', function(req, res) {
    res.render('auth');
  });

  app.post('/', passport.authenticate('local', {
    //add success message
    successRedirect: '/userprofile',
    //add message
    failureRedirect: '/',
  }));
  //add account page
  app.get('/signup', function(req, res) {
    res.render('add');
  });
  app.post('/signup', function(req, res) {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      if (err) throw err;
      var acc = accountSchema({username: req.body.username, password: hash, email: req.body.email});
      acc.save(function(err) {
        if (err) {
          //there should be a message flashing thing for this.
          res.redirect('/signup');
        } else {
          //message flash
          res.redirect('/userprofile');
        }
      });
    });
  });
  app.get('/userprofile', function(req, res) {
    res.render('userprofile');
  });
}
