const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/homepage", (req, res) => {
    console.log('this is the homepage for users - should show liked and saved resources')
  })

  return router;
}
