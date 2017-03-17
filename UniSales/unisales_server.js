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
    if (!req.body.email || !req.body.password)
    {
        res.statusCode = 404;
        return res.send("Email or password is missing");
    }
    var request = new Models.User({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname : req.body.lastname
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
              req.session.uid = user._id;
              console.log(req.session);
              return res.send({success: "Login OK"});
          } else {
              console.log("Password wrong");
              res.statusCode = 401;
              return res.send({error: "Login Failed"});
          }
        }
  });
}

// get product
function getProduct(req, res) {
    var id = req.params.uid;


    if(id)
    {
	
        findProduct(res, {ownerid:id});
    }
  
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an userid"});
    }
}
// change password
function changePass(req, res) {
    var id = req.query.uid;



    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    if(id)
    {
        changeUserPassword(res, {_id:id}, hash);
    }
   
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an userid"});
    }
}

// post a product
function postProduct(req, res)
{
    console.log("Create Product");

    var id = req.params.uid;
    console.log("uid: " + req.session.uid + " id: " + id)
    if (req.session.uid == id) {
        var newproduct = new Models.Product({
            productname: req.body.productname,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            ownerid : id
        });

       

        newproduct.save(function (err) {
              if (err) {
                console.log(err);
                res.statusCode = 403;
                return res.send("Failed to create a product");
              }
              else
              {
                    // Success: Send the updated product back
                    findProduct(res, {ownerid : id});
              }
          });
    } else {
        console.log("User trying to post to wrong account");
        res.statusCode=400;
        return res.send({error:"Wrong login"});
    }
}

function deleteProduct(req, res) {
    
    Models.Product.deleteOne({
      ownerid: parseInt(req.params.uid)
    }, function(err, result) {
	if (err) {
            console.log(err);
            res.statusCode = 403;
            return res.send("Failed to delete a product");
          }
          else
          {
                return res.send("Delete successfully");
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
            var result = {};
            result.email = users[0].email;
            result.firstname = users[0].firstname;
            result.lastname = users[0].lastname;
            console.log(JSON.stringify(result));
            return res.json(result);
        }
    });
}

function postComment(req, res)
{
    console.log("Create Comment");
    var request = new Models.Comment({
        title: req.body.title,
        message: req.body.message,
        product: req.body.product
    });
    request.save(function (err) {
        if (err) {
            console.log(err);
            res.statusCode = 403;
            return res.send("Failed to create a comment");
        }
        else
        {
            findComment(res, {title:req.body.title});
        }

    });
}

function findComment(res, query)
{
    Models.Comment.find(query, function(err, comments) {
        if (err)
        {
            throw err;
        }
        else if (!comments.length)
        {
            console.log("Can't find the comment(s)");
            res.statusCode = 404;
            return res.send("Failed to find the comment(s)");
        }
        else
        {
          console.log(JSON.stringify(comments));
          return res.json(comments);
        }
    });
}

function getComment(req, res)
{
    var productid = req.query.productid
    if(productid)
    {
        var query = {product: productid}
        findComment(res, query);
    }
    else
    {
        res.statusCode = 404;
        return res.send({error: "Please provide an productid"});
    }
}
function postCategory(req, res)
{
    console.log("Create Category");
    var request = new Models.Category({
        name: req.body.name,
        parent_category: req.body.parent_category
    });
    request.save(function (err) {
        if (err) {
            console.log(err);
            res.statusCode = 403;
            return res.send("Failed to create a category");
        }
        else
        {
            findCategoryWithDoesntExistPossibility(res, {name:req.body.name});
        }

    });
}

function findCategoryWithDoesntExistPossibility(res, query)
{
    Models.Category.find(query, function(err, categories) {
        if (err)
        {
            throw err;
        }
        else if (!categories.length)
        {
            console.log("Can't find the category");
            res.statusCode = 404;
            return res.send("Failed to find the category");
        }
        else
        {
          console.log(JSON.stringify(categories[0]));
          return res.json(categories[0]);
        }
    });
}

function findProduct(res, query)
{
    Models.Product.find(query, function(err, products) {
        if (err)
        {
            throw err;
        }
        else if (!products.length)
        {
            console.log("Can't find the products");
            res.statusCode = 404;
            return res.send("Failed to find the products matching: " + query);
        }
        else
        {
            console.log(JSON.stringify(products));
            return res.json(products);
        }
    });
}

function changeUserPassword(res, query, newpass)
{
    Models.User.update(query, { $set: { password : newpass }}, function(err, result) {
        if (err)
        {
            throw err;
        }
        else if (!result)
        {
            console.log("Can't find the user");
            res.statusCode = 404;
            return res.send("Failed to find the user");
        }
        else
        {
            console.log(JSON.stringify(result));
            return res.json("password changed successfully!");
        }
    });
}


// get product
function searchProduct(req, res) {
    
        console.log("Searching for products matching: " + req.body);
        findProduct(res, req.body);
}


function updateProduct(req,res) {
    console.log("Updating product")
}

function delProd(req,res) {
    console.log("Delete product")
}




// users
app.post('/user', postUser);
app.get('/user', getUser);
app.post('/login', login);

app.put('/user', changePass);
app.post('/user/:uid/products', postProduct);
app.get('/user/:uid/products', getProduct);
app.delete('/user/:uid/products', deleteProduct);

app.post('/comment', postComment);
app.get('/comment', getComment);

app.post('/category', postCategory);

app.get('/products', searchProduct);
app.put('/products/:pid', updateProduct);
app.delete('/products/:pid', delProd);

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');
