const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection');
const { v4: uuidv4 } = require('uuid');

/* GET users listing. */
router.get('/', (req, res) => {
  let query = 'SELECT * FROM mydb.customer';
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

//create customer
router.post('/add', (req, res) =>{
  const uuid = uuidv4();
  console.log(uuid);
  const post  = {
    id_customer: uuid, 
    customerName: req.body.customerName,
    customerLastName: req.body.customerLastName,
    customerAge: req.body.customerAge,
    customerPhoneNumber: req.body.customerPhoneNumber,
    customerEmail: req.body.customerEmail ,
    customerState: req.body.customerState 
  };
  console.log(req.body);

  let query = 'INSERT INTO mydb.customer SET ?';
  mysqlConnection.query(query, post, (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log('This customer added to database ! !');
      res.json(post.id_customer);
    }
  });
});

//delete customer
router.delete('/delete/:id', (req, res) => {
  console.log(req.body);
  let query = 'DELETE FROM customer WHERE id_customer = ?';
  mysqlConnection.query(query, [req.params.id], (err, result) => {
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    else{
      console.log('Deleted customer');
      res.send('Customer deleted from database');
    }
  });
});

// get a customer which is selected
router.get('/:id', (req, res) => {
  let query = 'SELECT * FROM mydb.customer WHERE id_customer = ?';
  mysqlConnection.query(query,[req.params.id], (err, result) => {
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
   }
  });
});
//update customer
router.put('/update/:id', (req, res) => {
  const post  = {
    id_customer: req.body.id_customer, 
    customerName: req.body.customerName,
    customerLastName: req.body.customerLastName,
    customerAge: req.body.customerAge,
    customerPhoneNumber: req.body.customerPhoneNumber,
    customerEmail: req.body.customerEmail ,
    customerState: req.body.customerState 
  };
  console.log(req.body);
  console.log(req.params.id);
  let query = 'UPDATE mydb.customer SET ? WHERE id_customer = ?';
  mysqlConnection.query(query, [post, req.params.id], (err, result) => {
    if(err){
      console.log(err);
    }
    else {
      console.log('This customer updated and added to database ! !');
      res.json('Customer is updated and added database');
    }
  });
});

//get id_customer using name and lastname params

router.get('/:customerName/:customerLastName',(req, res) => {
  const name = req.params.customerName;
  const lastname = req.params.customerLastName;
  console.log(name,lastname);
  let query = 'SELECT id_customer FROM mydb.customer WHERE customerName = ? && customerLastName = ?';
  mysqlConnection.query(query, [name, lastname], (err, result) => {
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  })
})

module.exports = router;
