const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/resource/:individualresource", (req, res) => {
    console.log('this is the individual resource page')
  })

  return router;
}
