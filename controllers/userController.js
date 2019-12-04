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
      if (!user) { return done(null, false, { message: 'Incorrect username'}); }
      if (bcrypt.compareSync(password, user.password)) {
        //flash correct password or something.
        req.session.user = username;
        return done(null, user, {message: 'Success'});
      } else {
        return done(null, false, {message: 'Incorrect password'});
      }
    });
  }
));

var sessionChecker = function(req, res, next) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  }));

  app.get('/', function(req, res) {
    if (!req.session.user) {
      res.redirect('/login');
    } else { 
      res.render('userprofile');
    }
  })

  app.post('/', function(req , res) {
  });

  //authentication portion.
  app.get('/login', sessionChecker, function(req, res) {
    res.render('auth');
  });

  app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}));

  //add account page
  app.get('/signup', sessionChecker, function(req, res) {
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
          req.session.user = req.body.username;
          res.redirect('/');
        }
      });
    });
  });

  app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
      if (err) throw err;
    })
    res.redirect('/login');
  });

}
