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

const asyncResources = async function() {
  console.log(await getResourcesForUser('tristanjacobs@gmail.com'));
}

asyncResources()



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

// const asyncEmail = async function() {
//   console.log(await findUserByEmail('12312@gmail.com'));
// }

// Query function - finds user and password in db
const findUserCredentials = function(email) {
  return pool.query(`
  SELECT email, password
  FROM users
  WHERE email = $1;
  `, [email])
  .then(res => res.rows[0]);
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
// const login = require("./routes/login-route.js");


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

// app.use("/", login(db))

// UP UNTIL HERE

// const findUserByEmail = (usersDb, email) => {
//   for (let user in usersDb) {
//     const userObj = usersDb[user];
//     if (userObj['email'] === email) {
//       console.log(userObj['email'])
//       return userObj;
//     }
//   }
//   return false;
// };

// AL added below:
// returns an object containing all resouces for a given userID:
const resourcesForUser = function (database, id) {
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

// get root directory - evenutally should be page of resources for guest users

// AL added below:
// app.get('/', (req, res) => {
//   const userObject = resourcesForUser(resourcesDatabase, 'user1'); // id hardcoded for now
//   const templateVars = { resources: userObject }; //, user: 'user1' }; // ?
//   res.render('guestpage', templateVars);
// });

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
  const templateVars = { resources: await getResourcesForUser() };
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
    const templateVars = { resources: await getResourcesForUser(), user: req.session.user_id };
  res.render("homepage", templateVars);
    // res.redirect('/homepage');
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
