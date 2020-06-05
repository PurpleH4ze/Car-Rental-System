const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection');

/* GET all cars */
router.get('/', (req, res) => {
  let query = 'SELECT * FROM mydb.car';
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

//adding car into database with post request
router.post('/add', (req, res) => {
  const post  = {
    carLicensePlate: req.body.carLicensePlate, 
    carBrand: req.body.carBrand,
    carModel: req.body.carModel,
    carGearBox: req.body.carGearBox,
    category_id: req.body.category_id,
    carRatePerDay: req.body.carRatePerDay 
  };
  console.log(req.body);

  let query = 'INSERT INTO mydb.car SET ?';
  mysqlConnection.query(query, post, (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log('This car added to database ! !');
      res.json('Car is added to database');
    }
  });
});

//get car which is selected
router.get('/:id',(req, res) => {
  let query = 'SELECT * FROM mydb.car WHERE carLicensePlate = ?';
  mysqlConnection.query(query,[req.params.id], (err, result) => {
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
   }
  });
});

//delete car which is selected
router.delete('/:id', (req, res) => {
  let query = 'DELETE FROM car WHERE carLicensePlate = ?';
  mysqlConnection.query(query, [req.params.id], (err, result) => {
    //TODO eger kiraya verilmis bir araba silinmek istenirse bunu kontrol et ona göre hata döndür
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    else{
      console.log('Deleted car ' + result.affectedRows);
      res.send('A Car is deleted from database');
    }
  });
});

//update car which is selected
router.post('/update/:id', (req, res) => {
  const post  = {
    carLicensePlate: req.body.carLicensePlate, 
    carBrand: req.body.carBrand,
    carModel: req.body.carModel,
    carGearBox: req.body.carGearBox,
    category_id: req.body.category_id,
    carRatePerDay: req.body.carRatePerDay 
  };
  console.log('The car to update');
  console.log(req.body);

  let query = 'UPDATE mydb.car SET ? WHERE carLicensePlate = ?';
  mysqlConnection.query(query, [post, req.params.id], (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log('This car updated and added to database ! !');
      res.json('Car is updated and added database');
    }
  });
})

module.exports = router;
