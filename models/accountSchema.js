var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  }, 
  password: {
    type: String, 
    unique: true,
    required: true,
    trim: true,
  }, 
  email: {
    type: String,
    required: true,
  } 
});

var Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
