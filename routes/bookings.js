const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection');
const { v4: uuidv4 } = require('uuid');

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

router.post('/addBooking', (req, res) => {
    //TODO price 0 hesaplaniyor. Bir rota içinde iki query çalıştırılmıyor hallet
  const pickupDateTime = () => {
    if(req.body.bookingPickUpDateTime) {
        return req.body.bookingPickUpDateTime;
    }
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  };

  const findPerRateDay = () => {
    var perRateDay = 0;  
    let query = 'SELECT carRatePerDay  FROM mydb.car WHERE carLicensePlate = ?';
    mysqlConnection.query(query, [req.body.carLicensePlate], (err, result) => {
      if(err) {
        console.log(err);
      }
      else{
        perRateDay = result[0].carRatePerDay;
        console.log('Per Rate Day = ' + perRateDay);
      }
    });
    return perRateDay;
  }
  
  const priceCalculation = (carPrice) => {
    const startDate = pickupDateTime();
    const endDate   = req.body.bookingReturnDateTime;
    const timeDiff  = (new Date(endDate)) - (new Date(startDate));
    const numberOfDays = timeDiff / (1000 * 60 * 60 * 24); 
    console.log('Number Of Days = ' + numberOfDays);

    const totalPrice = carPrice*numberOfDays;
    console.log('Total Price = ' + totalPrice);
    return totalPrice;
  };

  const uuid = uuidv4();
  console.log(uuid);
  console.log(req.body);

  const carPrice = findPerRateDay();
  var totalPrice = priceCalculation(carPrice);
  
  const booking = {
    booking_id: uuid,
    bookingPickUpDateTime: pickupDateTime(),
    bookingReturnDateTime: req.body.bookingReturnDateTime,
    price: totalPrice,
    customer_id: req.body.customer_id,
    carLicensePlate: req.body.carLicensePlate,
    car_category_id: req.body.car_category_id
  };
  console.log(booking);

  let query = 'INSERT INTO mydb.booking SET ?';
  mysqlConnection.query(query, booking, (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log('This booking added to database ! !');
      res.json('Booking is added to database');
    }
  });
});

router.get('/:id', (req, res) => {
  let query = 'SELECT * FROM mydb.booking WHERE booking_id = ?';
    mysqlConnection.query(query,[req.params.id], (err, result) => {
      if(err){
        console.log(err);
      }
      else{
        res.send(result);
     }
    });
});

router.put('/update/:id', (req, res) => {
  const post  = {
    bookingPickUpDateTime: req.body.bookingPickUpDateTime,
    bookingReturnDateTime: req.body.bookingReturnDateTime,
    price: req.body.price,
  };
  console.log(req.body);
  console.log(req.params.id);
  let query = 'UPDATE mydb.booking SET ? WHERE booking_id = ?';
  mysqlConnection.query(query, [post, req.params.id], (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log('This booking updated and added to database ! !');
      res.json('Booking is updated and added database');
    }
  });
});

router.delete('/delete', (req, res) => {
  console.log(req.body);
  let query = 'DELETE FROM booking WHERE booking_id = ?';
  mysqlConnection.query(query, [req.body.booking_id], (err, result) => {
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    else{
      console.log('Deleted booking');
      res.send('Booking deleted from database');
    }
  });
});

router.get('/sort/ByDate', (req, res) => {
  let query = 'SELECT * FROM mydb.booking ORDER BY bookingPickupDateTime';
  mysqlConnection.query(query, (err, result) => {
    if(err) {
      console.log(err);
    }
    else{
      res.json(result)
    }
  });
});

router.get('/sort/ByDateDesc', (req, res) => {
  let query = 'SELECT * FROM mydb.booking ORDER BY bookingPickupDateTime DESC';
  mysqlConnection.query(query, (err, result) => {
    if(err) {
      console.log(err);
    }
    else{
      res.json(result)
    }
  });
});

router.get('/sort/ByPrice', (req, res) => {
  let query = 'SELECT * FROM booking ORDER BY price';
  mysqlConnection.query(query, (err, result) => {
    if(err) {
      console.log(err);
    }
    else{
      res.json(result)
    }
  });
});

router.get('/sort/ByPriceDesc', (req, res) => {
  let query = 'SELECT * FROM booking ORDER BY price DESC';
  mysqlConnection.query(query, (err, result) => {
    if(err) {
      console.log(err);
    }
    else{
      res.json(result)
    }
  });
});

router.get('/sort/ByPrice/:id', (req, res) => {
  let query = 'SELECT * FROM booking WHERE price < ?';
  mysqlConnection.query(query, [req.params.id], (err, result) => {
    if(err) {
      console.log(err);
    }
    else{
      res.json(result)
    }
  });
});

module.exports = router;
