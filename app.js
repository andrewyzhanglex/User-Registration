//main file.
var express = require('express');
var userController = require('./controllers/userController');

//get, post, and delete are all express functions.
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//set up template engine
app.set('view engine', 'ejs');

//static files, ones that help us out in the public folder.
app.use(express.static('./public'));

app.listen(3000);
console.log('Listening to port 3000');

//call accountController
userController(app);