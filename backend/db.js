const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'carUser'
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(() => console.log('Successfully connected to the MySQL database (Promise Pool).'))
    .catch(err => console.error('Error connecting to database:', err.code));

module.exports = pool;