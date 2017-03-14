var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var Models = require('./model/models');
var app = express();

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
        firstname : req.body.firstname,
        password: req.body.password,
    });

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

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');