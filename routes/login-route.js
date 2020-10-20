// const express = require('express');
// const router  = express.Router();
// const getUserWithEmail = require("../database");

// module.exports = function(db) {
//   const login =  function(email, password) {
//     return db.getUserWithEmail(email)
//     .then(user => {
//       if (bcrypt.compareSync(password, user.password)) {
//         return user;
//       }
//       return null;
//     });
//   }

//   router.post('/', (req, res) => {
//     const {email, password} = req.body;
//     console.log(req.body)
//     login(email, password)
//       .then(user => {
//         if (!user) {
//           res.send({error: "error"});
//           return;
//         }
//         req.session.userId = user.id;
//         res.send({user: {name: user.name, email: user.email, id: user.id}});
//       })
//       .catch(e => res.send(e));
//   });

//   return router;
// }
