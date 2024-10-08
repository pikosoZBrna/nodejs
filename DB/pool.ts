const mysql = require('mysql2')
require('dotenv').config()

  export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,   
    connectionLimit: 10,
    multipleStatements: false, 
    port: process.env.DB_PORT
  })

  
  