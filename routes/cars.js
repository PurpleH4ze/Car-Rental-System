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

router.get('/sortByCategory/:id', (req, res) => {
  let query = 'SELECT * FROM car WHERE category_id = ?';
  mysqlConnection.query(query, [req.params.id], (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log('The cars sorted by categories...');
      res.json(result);
    }
  });
});

router.get('/sortByPerDay/:id', (req, res) => {
  let query = 'SELECT * FROM car WHERE carRatePerDay < ?';
  mysqlConnection.query(query, [req.params.id], (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log(`The cars sorted that is price under ${req.params.id} ...`);
      res.json(result);
    }
  });
});

router.get('/sortByMostExpensive', (req, res) => {
  let query = 'SELECT * FROM car ORDER BY carRatePerDay ';
  mysqlConnection.query(query, (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log('The cars sorted by most expensive ...');
      res.json(result);
    }
  });
});

router.get('/sortByMostCheap', (req, res) => {
  let query = 'SELECT * FROM car ORDER BY carRatePerDay DESC';
  mysqlConnection.query(query, (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log('The cars sorted by most cheap ...');
      res.json(result);
    }
  });
});

//adding car into database with post request
router.post('/add', (req, res) => {

  const categoryId = req.body.category_id;
  console.log(categoryId);
  const fixCategoryId = () => {
    if (categoryId === "Lüks") return 1;
    if (categoryId === "Ekonomik") return 2;
    if (categoryId === "Aile") return 3;
    if (categoryId === "Standard") return 4;
  }
  const post  = {
    carLicensePlate: req.body.carLicensePlate, 
    carBrand: req.body.carBrand,
    carModel: req.body.carModel,
    carGearBox: req.body.carGearBox,
    category_id: fixCategoryId(),
    carRatePerDay: req.body.carRatePerDay 
  };
  console.log(req.body);
  console.log(post);

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
router.put('/update/:id', (req, res) => {

  const categoryId = req.body.category_id;
  console.log(categoryId);
  const fixCategoryId = () => {
    if (categoryId === "Lüks") return 1;
    if (categoryId === "Ekonomik") return 2;
    if (categoryId === "Aile") return 3;
    if (categoryId === "Standard") return 4;
  }

  const post  = {
    carLicensePlate: req.body.carLicensePlate, 
    carBrand: req.body.carBrand,
    carModel: req.body.carModel,
    carGearBox: req.body.carGearBox,
    category_id: fixCategoryId(),
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
