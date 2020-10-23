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
  SELECT name, category_name, url, title, description
  FROM resources
  JOIN users ON user_id = users.id;
  `;
  const query = {
    text: queryString,
    rowMode: 'array'
  }
  return pool.query(query)
    .then(res => (res.rows.map(row => ({
      user: row[0],
      category: row[1],
      url: row[2],
      title: row[3],
      description: row[4]
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
// Sorts out db resources and displays them by category
const getResourcesByCategory = function(category) {
  let queryString = `
  SELECT *
  FROM resources
  JOIN users ON user_id = users.id
  WHERE category_name = $1;`;
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
}
// Query function - add new resource to db
const addNewResource = function (resource) {
  return pool.query(`
  INSERT INTO resources (user_id, category_id, url, title, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
  `, [resource.userId, resource.category, resource.url, resource.title, resource.description])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
};

const getUserId = function (email) {
  return pool.query( `
  SELECT id
  FROM users
  WHERE email = $1;
  `, [email])
  .then(res => res.rows[0].id);
};

const asyncId = async function() {
  console.log(await getUserId('tristanjacobs@gmail.com'))
}

asyncId();
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

// Query function - adds new comment to db
const addComment = function(commentObj) {
  return pool.query(`
  INSERT INTO comments (user_id, resource_id, message, date)
  VALUES ($1, $2, $3, $4);`, [commentObj.userId, commentObj.resourceId, commentObj.message, 'NOW()'])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
}

// helper function - find resource ID with title name
const findResourceIdByTitle = function(title) {
  return pool.query(`
  SELECT id
  FROM resources
  WHERE title LIKE $1;
  `, [`%${title}%`])
  .then(res => res.rows[0]);
}

// returns all comment messages and dates from db
const getAllComments = function(individualResource) {
  const queryString = `
  SELECT message, date, users.name
  FROM comments
  JOIN users ON user_id = users.id
  WHERE resource_id = $1;
  `

  const query = {
    text: queryString,
    rowMode: 'array'
  }

  return pool.query(query, [individualResource])
  .then(res => (res.rows.map(row => ({
    message: row[0],
    date: row[1],
    user: row[2],
  }))))
}

// adds like to resource from specific user
const addUserLike = function(user, resource) {
  return pool.query(`
  INSERT INTO user_likes(user_id, resource_id)
  VALUES($1, $2)
  RETURNING *;
  `, [user, resource])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
}


// gets all resources that are liked by a user
const likedByUser = function(user) {
  let queryString = `
  SELECT DISTINCT ON (resource_id) *
  FROM user_likes
  JOIN resources ON resource_id = resources.id
  JOIN users ON resources.user_id = users.id
  WHERE user_likes.user_id = $1;
  `;

  const query = {
    text: queryString,
    rowMode: 'array'
  }

  return pool.query(query, [user])
  .then(res => (res.rows.map(row => ({
    name: row[10],
    category: row[5],
    url: row[6],
    title: row[7],
    description: row[8]
  }))))
  .catch(err => console.error('query error', err.stack));
}

// Updates name in database
const updateName = function(newName, email) {
  return pool.query(`
  UPDATE users
  SET name = $1
  WHERE email = $2
  `, [newName, email])
  .then(res => res.rows[0]);
}

// adds user rating to db
const addRating = function(currentUser, rate , resource) {
  return pool.query(`
  INSERT INTO resource_ratings(user_id, rating, resource_id)
  VALUES($1, $2, $3)
  RETURNING *;
  `, [currentUser, rate, resource])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
}

const avgRating = function(resource) {
  return pool.query(`
  SELECT AVG(rating)
  FROM resource_ratings
  WHERE resource_id = $1;
  `, [resource])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
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
  const resources = await getResources();
  console.log("This is the resources: ", resources);
  const templateVars = { user: req.session.id, resources };
  res.render('guestpage', templateVars);
});
// homepage for users - redirect here after login + shows liked & saved resources
// AL added below:
app.get("/homepage", async function(req, res) {
  if (!req.session.user_id) {
    res.redirect('/register');
  }

  let userId = await getUserId(req.session.user_id)
  const templateVars = {
    user: req.session.user_id,
    resources: await getResourcesForUser(req.session.user_id),
    likedResources: await likedByUser(userId) };
  res.render("homepage", templateVars);
})

// route to make a new resource
app.get("/newresource", (req, res) => {
  const templateVars = { user: req.session.user_id };
  res.render("newResource", templateVars);
})

// route for individual categories
app.get("/category/:categoryID", async function(req, res) {
  const templateVars = { user: req.session.user_id,
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
  console.log('this is inside get', req.params.individualresource);
  let newTitle = req.params.individualresource.split('%20').join(' ');
  let idForResource = await findResourceIdByTitle(newTitle)

  let resParam = req.params.individualresource
  console.log('meow', resParam)
  const resourceVar = await findResourceIdByTitle(resParam);
  const blah = await avgRating(resourceVar['id'])
  console.log(blah[0]['avg'])

  const templateVars = { user: req.session.user_id,
    resources: await getIndividualResource(newTitle),
    comments: await getAllComments(idForResource['id']),
    rating: await avgRating(resourceVar['id'])
  }
  res.render("individualResource", templateVars)
})
// route for search results
app.get("/search/:searchQuery", async function(req, res) {
  let searchVar = req.params.searchQuery;
  const templateVars = { user: req.session.user_id,
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
      information: await findUserInfo(req.session.user_id),
      user: req.session.user_id
    }
    res.render("profile", templateVars)
  }
})
// POST routes
// inputs form into end of query to get search results
app.post("/search/:searchQuery", function(req, res) {
  let searchQueryUrl = req.params.searchQuery;
  searchQueryUrl = req.body.searchResult;
  res.redirect(`/search/${searchQueryUrl}`)
})

app.post("/resource/:individualresource", async function(req, res) {
  console.log('look at me', req.body.cmt)
  let resParam = req.params.individualresource
  const urlString = req.headers.referer.split('/');
  resParam = urlString[urlString.length-1].split('%20').join(' ');
  const resourceVar = await findResourceIdByTitle(resParam);
  addComment({
    message: req.body.cmt,
    resourceId: resourceVar['id'],
    userId: await getUserId(req.session.user_id)
  })
  console.log(req.body)
  res.redirect('back');
})

app.post("/newresource", async function(req, res) {
  const userId = await getUserId(req.session.user_id)
  const title = req.body.title;
  const description = req.body.description;
  const url = req.body.url;
  const category = 4; //req.body.category; // this should be just a number, unless we change db to accept names
  let newResource = {
    userId,
    category,
    url,
    title,
    description
  };
  addNewResource(newResource);
  res.redirect('/homepage');
})
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
    //NEW ----
    req.session.user_id = email;
    const templateVars = { resources: await getResourcesForUser(), user: req.session.user_id };
  res.render("homepage", templateVars);
    // res.redirect('homepage');
    // ------
  }
})
//login - change username to email **, error to pop up for incorrect password
app.post("/", async function(req, res) {
  const { username, psw } = req.body;
  let user = await findUserCredentials(username);
  console.log('1 req.body: ', req.body);
  console.log('2 user: ', user)
  if (!user) {
    res.status(403).json({ message: "Email cannot be found" });
  } else if (user) {
    // AL added next line:
    const templateVars = { resources: await getResourcesForUser(), user: req.session.user_id};
    bcrypt.compare(psw, user['password'], function (err, isPasswordMatched) {
      if (isPasswordMatched) {
        //NEW ------
        req.session.user_id = username;
        //res.redirect("/homepage");
        res.json({success: true});
        //-------
      } else {
        res.json({error: "Incorrect Password"})
        //res.render("register", { error: "Incorrect Password", user: user });
      }
    });
  }
});
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
})

app.post("/resource/:individualresource/liked", async function(req, res) {
  let user = await getUserId(req.session.user_id);
  let resParam = req.params.individualresource
  const urlString = req.headers.referer.split('/');
  resParam = urlString[urlString.length-1].split('%20').join(' ');
  let resourceVar = await findResourceIdByTitle(resParam);
  addUserLike(user, resourceVar['id'])
  res.redirect("/homepage")
})

app.post("/resource/:individualresource/rating", async function(req, res) {
  const rate = req.body.rate;
  const user = await getUserId(req.session.user_id);
  let resParam = req.params.individualresource
  const urlString = req.headers.referer.split('/');
  resParam = urlString[urlString.length-1].split('%20').join(' ');
  const resourceVar = await findResourceIdByTitle(resParam);
  addRating(user, rate, resourceVar['id'])
  res.redirect('back');
})

app.post("/update/name", async function(req, res) {
  const formName = req.body.updateName;
  await updateName(formName, req.session.user_id)
  res.redirect("/profile")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
