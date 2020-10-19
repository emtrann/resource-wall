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
// own code below
const bcrypt = require('bcrypt');
// const cookieSession = require('cookie-session');

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
// own code below
// app.use(cookieSession({
//   name: 'session',
//   keys: ['asdf', 'lkjhg']
// }));

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
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// own code.
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

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
// app.get("/", (req, res) => {
//   res.render("index");
// });
app.get('/', (req, res) => {
  // if (!req.session.user_id) {
  //   res.redirect('/login');
  // }
  const userObject = resourcesForUser(resourcesDatabase, 'user1'); // id hardcoded for now
  const templateVars = { resources: userObject }; //, user: 'user1' }; // ?
  res.render('index', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
