var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var Models = require('./model/models');
var bcrypt = require('bcrypt');
var app = express();
var SALT_WORK_FACTOR = 10;

app.use(express.static(__dirname + '/'));


// Set up to use a session
app.use(session({
  secret: 'super_secret',
  resave: false,
  saveUninitialized: false
}));

// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Include validator here
app.use(expressValidator());


// Functions
function postUser(req, res)
{
    console.log("Create User");
    var request = new Models.User({
        email: req.body.email,
        firstname: req.body.firstname,
        firstname : req.body.firstname
    });

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    request.password = hash;

    request.save(function (err) {
          if (err) {
            console.log(err);
            res.statusCode = 403;
            return res.send("Failed to create a user");
          }
          else
          {
                // Success: Send the updated user back
                findUserWithDoesntExistPossibility(res, {email:req.body.email});
          }
      });
}

// Function for get a user
function getUser(req, res) {
    var id = req.query.id;
    var email = req.query.email;
    if(id)
    {
        findUserWithDoesntExistPossibility(res, {_id:id});
    }
    else if (email)
    {
        findUserWithDoesntExistPossibility(res, {email:email});
    }
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an userid"});
    }
}

function login(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  Models.User.findOne({email: email}, function(err, user) {
        if (err)
        {
            throw err;
        }
        else if (!user)
        {
            console.log("Can't find the user");
            res.statusCode = 404;
            return res.send("Failed to find the user");
        }
        else
        {
          // test a matching password
          var result = bcrypt.compareSync(password, user.password);
          if (result) {
              console.log("Password correct");
              req.session.email = req.body.email;
              console.log(req.session);
              return res.send({success: "Login OK"});
          } else {
              console.log("Password wrong");
              return res.send({error: "Login Failed"});
          }
        }
  });
}
// Helper function for find user
function findUserWithDoesntExistPossibility(res, query)
{
    Models.User.find(query, function(err, users) {
        if (err)
        {
            throw err;
        }
        else if (!users.length)
        {
            console.log("Can't find the user");
            res.statusCode = 404;
            return res.send("Failed to find the user");
        }
        else
        {
            console.log(JSON.stringify(users[0]));
            return res.json(users[0]);
        }
    });
}
// users
app.post('/user', postUser);
app.get('/user', getUser);
app.post('/login', login);

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');