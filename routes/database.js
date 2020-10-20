// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'vagrant',
//   password: '123',
//   host: 'localhost',
//   database: 'midterm',
// });

// // function not necessary - using it to check to see if database returns info
// const getAllUsers = function() {
//   return pool.query(`
//   SELECT *
//   FROM users`)
//     .then((res) => {
//       return res;
//     })
// }

// console.log(getAllUsers());

// const getUserWithEmail = function(email) {
//   return pool.query(`
//   SELECT *
//   FROM users
//   WHERE email = $1;
//   `, [email])
//     .then(res => res.rows[0])
//     .catch(res => res.rows[null]);
// }


// console.log(getUserWithEmail('tristanjacobs@gmail.com'))

// module.exports = getUserWithEmail;
