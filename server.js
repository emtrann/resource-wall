// load .env data into process.env
require('dotenv').config();
// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');
// const databaseQueries = require('/queries')
// AL added
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
// PG database client/connection setup
const { Client } = require('pg');
// const dbParams = require('./lib/db.js');
// const db = new Pool(dbParams);
const pool = new Client({
  user: 'vagrant',
  username: 'labber',
  password: '123',
  host: 'localhost',
  database: 'midterm'
});
pool.connect();
// Query function to database to get all resources
const getResources = function () {
  let queryString = `
  SELECT *
  FROM resources;`;
  const query = {
    text: queryString,
    rowMode: 'array'
  }
  return pool.query(query)
    .then(res => (res.rows.map(row => ({
      user: row[1],
      category: row[2],
      url: row[3],
      title: row[4],
      description: row[5]
    }))))
    .catch(err => console.error('query error', err.stack));
};
// Query function to get resources for one user
const getResourcesForUser = function(email) {
  let queryString = `
  SELECT *
  FROM resources
  JOIN users ON user_id = users.id
  WHERE email = $1;`;
  const query = {
    text: queryString,
    rowMode: 'array'
  }
  return pool.query(query, [email])
    .then(res => (res.rows.map(row => ({
      name: row[7],
      category: row[2],
      url: row[3],
      title: row[4],
      description: row[5]
    }))))
    .catch(err => console.error('query error', err.stack));
};

<<<<<<< HEAD
// Sorts out db resources and displays them by category
const getResourcesByCategory = function(category) {
  let queryString = `
  SELECT *
  FROM resources
  JOIN users ON user_id = users.id
  WHERE category_id = $1;`;
  const query = {
    text: queryString,
    rowMode: 'array'
  }
  return pool.query(query, [category])
  .then(res => (res.rows.map(row => ({
    name: row[7],
    category: row[2],
    url: row[3],
    title: row[4],
    description: row[5]
  }))))
  .catch(err => console.error('query error', err.stack));
}

// Query - gets individual resource in db
const getIndividualResource = function(resourceTitle) {
  let queryString = `
  SELECT *
  FROM resources
  JOIN users ON user_id = users.id
  WHERE title LIKE $1;
  `;

  const query = {
    text: queryString,
    rowMode: 'array'
  }

  return pool.query(query, [`%${resourceTitle}%`])
  .then(res => (res.rows.map(row => ({
    name: row[7],
    category: row[2],
    url: row[3],
    title: row[4],
    description: row[5]
  }))))
  .catch(err => console.error('query error', err.stack));
}

// Query - goes through db using search form - only searches through title, url and description atm
const getSearchResource = function(searchStr) {
  let queryString = `
  SELECT *
  FROM resources
  JOIN users ON user_id = users.id
  WHERE title LIKE $1 OR url LIKE $1 OR description LIKE $1
  `;

  const query = {
    text: queryString,
    rowMode: 'array'
  }

  return pool.query(query, [`%${searchStr}%`])
  .then(res => (res.rows.map(row => ({
    name: row[7],
    category: row[2],
    url: row[3],
    title: row[4],
    description: row[5]
  }))))
  .catch(err => console.error('query error', err.stack));
=======
// const asyncResources = async function() {
//   console.log(await getResourcesForUser('tristanjacobs@gmail.com'));
// }

// asyncResources()

// Query function - add new user to db
const addNewUser = function (user) {
  return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`,
      [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch(err => console.error('query error', err.stack));
>>>>>>> jquery
}



// Query function - add new resource to db
const addNewResource = function (resource) {
  return pool.query(`
  INSERT INTO resources (user_id, category_name, url, title, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
  `, [resource.userId, resource.category, resource.url, resource.title, resource.description])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
};
const getUserId = function () {
  return pool.query( `
  SELECT id
  FROM users
  WHERE email = 'tristanjacobs@gmail.com'
  `)
  .then(res => res.rows[0].id)
};
<<<<<<< HEAD
const asyncUserId = async function() {
  console.log('user ID: ', await getUserId());
}
asyncUserId();
=======

// const asyncUserId = async function() {
//   console.log('user ID: ', await getUserId());
// }
// asyncUserId();
>>>>>>> jquery


// Query function - add new user to db
const addNewUser = function (user) {
  return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`,
      [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch(err => console.error('query error', err.stack));
}

// Query function - sorts through db to find if user email exists
const findUserByEmail = function(email) {
  return pool.query(`
  SELECT email
  FROM users
  WHERE email = $1;
  `, [email])
  .then(res => res.rows[0]);
}

//Query function - finds all info for users to go onto profile
const findUserInfo = function(email) {
  const queryString = `
  SELECT *
  FROM users
  WHERE email = $1;
  `

  const query = {
    text: queryString,
    rowMode: 'array'
  }

  return pool.query(query, [email])
  .then(res => (res.rows.map(row => ({
    id: row[0],
    name: row[1],
    email: row[2],
  }))))
}

// Query function - finds user and password in db
const findUserCredentials = function(email) {
  return pool.query(`
  SELECT email, password
  FROM users
  WHERE email = $1;
  `, [email])
  .then(res => res.rows[0]);
}


const addRating = function(rating, resourceId) {
  return pool.query(
    `INSERT INTO resource_ratings (rating, resource_id)
    VALUES ( $1, $2 )
    RETURNING *;`,
    [rating, resourceId])
    .then(res => res.rows[0])
    .catch(err => console.error("Rating not submitted: ", err));
}
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
// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const homepageRoutes = require("./routes/homepage");
const individualResourceRoutes = require("./routes/individualResource");
const newResourceRoutes = require("./routes/newResource");
const register = require("./routes/register");
const categories = require("./routes/categories");
const { request } = require('express');
// const login = require("./routes/login-route.js");
// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
// get root directory - evenutally should be page of resources for guest users
// AL added below:
app.get('/', async function (req, res) {
  const templateVars = { resources: await getResources() };
  res.render('guestpage', templateVars);
});
// homepage for users - redirect here after login + shows liked & saved resources
// AL added below:
app.get("/homepage", async function(req, res) {
  if (!req.session.user_id) {
    res.redirect('/register');
  }
  const templateVars = {
    user: req.session.user_id,
    resources: await getResourcesForUser(req.session.user_id) };
  res.render("homepage", templateVars);
})
// route to make a new resource
app.get("/newresource", (req, res) => {
  res.render("newResource")
})
// route for individual categories
app.get("/category/:categoryID", async function(req, res) {
  const templateVars = {
    resources: await getResourcesByCategory(req.params.categoryID)
  }
  res.render("categories", templateVars);
})
// route to register
// AL added below:
app.get("/register", (req, res) => {
  const templateVars = { user: req.session.user_id };
  res.render("register", templateVars);
});
// route for individual resources
app.get("/resource/:individualresource", async function(req, res) {
  console.log(req.params.individualresource);
  let newTitle = req.params.individualresource.split('+').join(' ');
  const templateVars = {
    resources: await getIndividualResource(newTitle)
  }
  res.render("individualResource", templateVars)
})

// route for search results
app.get("/search/:searchQuery", async function(req, res) {
  let searchVar = req.params.searchQuery;
  const templateVars = {
    resources: await getSearchResource(searchVar)
  }
  console.log(templateVars)
  res.render("searchResult", templateVars)
})

// profile route
app.get("/profile", async function(req, res) {
  if (!req.session.user_id) {
    res.status(400).json({ message: 'Please sign in to view your profile' });
  } else {
    const templateVars = {
      user: await findUserInfo(req.session.user_id)
    }
    res.render("profile", templateVars)
  }
})
// POST routes

<<<<<<< HEAD
// inputs form into end of query to get search results
app.post("/search/:searchQuery", function(req, res) {
  let searchQueryUrl = req.params.searchQuery;
  searchQueryUrl = req.body.searchResult;
  res.redirect(`/search/${searchQueryUrl}`)
})

=======
>>>>>>> jquery
app.post("/newresource", async function(req, res) {
  const userId = 1; //req.session.userId;//await getUserId(); // gets value from db through query function
  const title = req.body.title;
  const description = req.body.description;
  const url = req.body.url;
  const category = req.body.category;
  addNewResource ({
    userId,
    category,
    url,
    title,
    description
  });

  res.redirect('/homepage');
})
<<<<<<< HEAD
=======

>>>>>>> jquery
app.post("/register", async function(req, res) {
  const name = req.body.username;
  const email = req.body.email;
  const prehashPassword = req.body.password;
  const password = bcrypt.hashSync(prehashPassword, 10);
  if (email === '' || password === '') {
    res.status(400).json({ message: 'Please enter email and password' }); // change to slide down message
  }
  if (await findUserByEmail(email) !== undefined) {
    console.log(await findUserByEmail(email))
    res.status(400).json({ message: 'This email already exists' });
  } else {
    addNewUser({
      name,
      email,
      password
    })
    req.session.user_id = email;
    const templateVars = { resources: await getResourcesForUser(), users: req.session.user_id };
  res.render("homepage", templateVars);
    // res.redirect('homepage');
  }
})
//login - change username to email **, error to pop up for incorrect password
app.post("/", async function(req, res) {
  const { username, psw } = req.body;
  let user = await findUserCredentials(username);
  console.log(req.body);
  console.log(user)
  if (!user) {
    res.status(403).json({ message: "Email cannot be found" });
  } else if (user) {
    // AL added next line:
    const templateVars = { resources: await getResourcesForUser(), user: req.session.user_id};
    bcrypt.compare(psw, user['password'], function (err, isPasswordMatched) {
      if (isPasswordMatched) {
        req.session.user_id = username;
        res.redirect("/homepage");
      } else {
        res.render("register", { error: "Incorrect Password", user: user });
      }
    });
  }
});
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
