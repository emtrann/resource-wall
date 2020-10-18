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

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

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

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const homepageRoutes = require("./routes/homepage");
const individualResourceRoutes = require("./routes/individualResource");
const newResourceRoutes = require("./routes/newResource");
const register = require("./routes/register");


// NOT ACTUALLY SURE WHAT THIS DOES HERE -m
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
// Note: mount other resources here, using the same pattern above
app.use("/homepage", homepageRoutes(db));
app.use("/:individualresource", individualResourceRoutes(db));
app.use("/newresource", newResourceRoutes(db));
app.use("/register", register(db));
// UP UNTIL HERE

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// get root directory - evenutally should be page of resources for guest users
app.get("/", (req, res) => {
  res.render("index");
});

// homepage for users - redirect here after login + shows liked & saved resources
app.get("/homepage", (req, res) => {
  res.render("homepage");
})

// route to make a new resource
app.get("/newresource", (req, res) => {
  res.render("newResource")
})

// route to register
app.get("/register", (req, res) => {
  res.render("register")
})

// route for individual resources
app.get("/:individualresource", (req, res) => {
  res.render("individualResource")
})

// POST routes

app.post("/newresource", (req, res) => {
  // let title = form input title
  // take in req information and push it to database
  //redirect to my my resources
})

app.post("/register", (req, res) => {
  // email, password + user = req.body
  // if forms are empty, return error
  // helper function? determine that our username/email is not already in the database
  // OTHERWISE
  // add user to DB
  // HASH PASSWORD
  //redirect to my my resources
})

app.post("/logout", (req, res) => {
  // CLEAR COOKIE
  // redirect to root page
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
