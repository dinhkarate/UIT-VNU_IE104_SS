// db.js
const { Pool } = require('pg');
require('dotenv').config(); // Load biến môi trường từ file .env

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'SportSpot',
  password: process.env.DB_PASSWORD || '1',
  port: process.env.DB_PORT || '5432',
});


module.exports = pool;