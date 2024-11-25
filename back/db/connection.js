const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root', // Replace with your MySQL username
//   password: '', // Replace with your MySQL password
//   database: 'ene', // Replace with your database name
// });

// module.exports = pool.promise();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'password', // Replace with your MySQL password
  database: 'ene_db', // Replace with your database name
});

module.exports = pool.promise();

