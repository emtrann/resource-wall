const getResources = function(options) {
  let queryString = `
  SELECT *
  FROM resources;`;
  return pool.query(queryString)
  .then(res => res.rows);
};

module.exports = { getResources }
