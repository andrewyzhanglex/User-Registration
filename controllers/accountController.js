var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var accountSchema = require('../models/accountSchema');
var bcrypt = require('bcrypt');
var saltRounds = 10;

mongoose.connect('mongodblink', {useUnifiedTopology: true, useNewUrlParser: true});

//sends this function back.
module.exports = function(app) {
  app.get('/add', function(req, res) {
    res.render('add');
  });

  app.post('/add', function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      var acc = accountSchema({username: req.body.username, password: hash, email: req.body.email});
      acc.save(function(err) {
        if (err) {
          res.send('The Username or Email that you have entered is already in use');
        } else {
          res.send('success, welcome.')
        }
      });
    });
  });

  app.delete('/add', function(req, res) {
  });
}
