const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '>9/N]mlXwp8+47m',
    database: 'mydb',
    multipleStatements: true
  })
  
  mysqlConnection.connect((err) => {
      if(err) {
          console.log(err);
      }
      else{
        console.log('Connected to database ! ');
      }
  })
  module.exports = mysqlConnection;