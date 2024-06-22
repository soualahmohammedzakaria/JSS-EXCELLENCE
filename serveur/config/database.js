const mysql = require('mysql');
const config = require('./dbconfig.json');

// Create a MySQL connection pool
const db = mysql.createPool({
  host: config.db.host,  
  user: config.db.user,        
  password: config.db.password,  
  database: config.db.database,  
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