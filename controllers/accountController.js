var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var accountSchema = require('../models/accountSchema');

mongoose.connect('<mongodblink>', {useUnifiedTopology: true, useNewUrlParser: true});


//sends this function back.
module.exports = function(app) {
  app.get('/add', function(req, res) {
    res.render('add');
  });

  app.post('/add', function(req, res) {
    var acc = accountSchema({username: req.body.username, password: req.body.password, email: req.body.email}).save(function(err) {
      if (err) throw err;
      console.log('Success, Welcome to BT');
    });
  });

  app.delete('/add', function(req, res) {
  });
}
