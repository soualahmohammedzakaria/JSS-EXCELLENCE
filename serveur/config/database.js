const mysql = require('mysql');


// Create a MySQL connection pool
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "club_db",
  });

  db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
      }
      console.log('Connected to MySQL as ID ' + connection.threadId);
    
      // Release the connection back to the pool
      connection.release();
    });

module.exports = db;

  