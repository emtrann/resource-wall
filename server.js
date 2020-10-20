// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

// AL added
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

// PG database client/connection setup
// const { Pool } = require('pg');
// const dbParams = require('./lib/db.js');
// const db = new Pool(dbParams);
// db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// AL added below
app.use(cookieSession({
  name: 'session',
  keys: ['asdf', 'lkjhg']
}));
// Temporary Data to be replaced by Database:
const resourcesDatabase = {
  1: { URL: 'https://business.tutsplus.com/tutorials/how-to-start-a-business--cms-25638', title: 'Awesome business tutorial!', description: 'All you need to know to start yout own company', userID: "user1" },
  2: { URL: 'https://www.khanacademy.org/science/high-school-physics', title: 'Physics 101', description: 'The best way to learn physics!', userID: "user1" },
  3: { URL: 'https://www.freecodecamp.org/news/free-online-programming-cs-courses/', title: 'Software development tutorial', description: 'Well explain software development intro', userID: "user2" }
};
const users = {
  "user1": {
    id: "user1",
    email: "user1@example.com",
    password: bcrypt.hashSync("password", 10)
  },
  "user2": {
    id: "user2",
    email: "user2@example.com",
    password: bcrypt.hashSync("password", 10)
  }
};

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const homepageRoutes = require("./routes/homepage");
const individualResourceRoutes = require("./routes/individualResource");
const newResourceRoutes = require("./routes/newResource");
const register = require("./routes/register");
const categories = require("./routes/categories");


// NOT ACTUALLY SURE WHAT THIS DOES HERE -m
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
// // Note: mount other resources here, using the same pattern above
// app.use("/homepage", homepageRoutes(db));
// app.use("/resource/:individualresource", individualResourceRoutes(db));
// app.use("/newresource", newResourceRoutes(db));
// app.use("/register", register(db));
// app.use("/category/:categoryID", categories(db));

// UP UNTIL HERE

// AL added below:
// returns an object containing all resouces for a given userID:
const resourcesForUser = function(database, id) {
  const filteredResources = {};
  for (let resourceId in database) {
    const resourceObj = database[resourceId];
    if (resourceObj.userID === id) {
      filteredResources[resourceId] = resourceObj;
    }
  }
  return filteredResources;
};
// random string for user ID:
const generateRandomString = function() {
  return Math.random().toString(16).slice(2, 7);
};

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// get root directory - evenutally should be page of resources for guest users

// AL added below:
app.get('/', (req, res) => {
  // if (!req.session.user_id) {
  //   res.redirect('/login');
  // }
  const userObject = resourcesForUser(resourcesDatabase, 'user1'); // id hardcoded for now
  const templateVars = { resources: userObject }; //, user: 'user1' }; // ?
  res.render('guestpage', templateVars);
});

// homepage for users - redirect here after login + shows liked & saved resources
// AL added below:
app.get("/homepage", (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/register');
  }
  const userObject = resourcesForUser(resourcesDatabase, req.session.user_id);
  const templateVars = { resources: userObject, user: users[req.session.user_id] };
  res.render("homepage", templateVars);
})

// route to make a new resource
app.get("/newresource", (req, res) => {
  res.render("newResource")
})

// route for individual categories
app.get("/category/:categoryID", (req, res) => {
  res.render("categories")
})

// route to register
// AL added below:
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render("register", templateVars);
});


// route for individual resources
app.get("/resource/:individualresource", (req, res) => {
  res.render("individualResource")
})


// POST routes

app.post("/newresource", (req, res) => {
  // let title = form input title
  // take in req information and push it to database
  //redirect to my my resources
})

app.post("/register", (req, res) => {
  const newUserId = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email === '' || password === '') {
    res.status(400).json({message: 'Please enter email and password'}); // change to slide down message
  }
  for (let user in users) {
    if (email === users[user].email) {
      res.status(400).json({message: 'Email already exists'});
    }
  }
  users[newUserId] = { id: newUserId, email: email, password: hashedPassword };
  req.session.user_id = newUserId;
  res.redirect('homepage');
})

app.post("/logout", (req, res) => {
  // CLEAR COOKIE
  // redirect to root page
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
