const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection');

/* GET users listing. */
router.get('/', (req, res) => {
  let query = 'SELECT * FROM mydb.booking';
  mysqlConnection.query(query, (err, result)  => {
    if(err){
      console.log(err);
    }
    else {
      console.log('Execution success')
    res.json(result);
    }
  });
});

module.exports = router;
