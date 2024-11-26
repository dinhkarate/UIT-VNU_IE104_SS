// db.js
const { Pool } = require('pg');
require('dotenv').config(); // Load biến môi trường từ file .env

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
/*
// Kiểm tra kết nối
pool.connect()
  .then(client => {
    console.log('Connected to the database');
    
    // Thực hiện truy vấn lấy dữ liệu từ bảng 'field'
    return client.query('SELECT * FROM fields')
      .then(res => {
        console.log('Query result:', res.rows);  // In kết quả trả về từ cơ sở dữ liệu
      })
      .catch(err => {
        console.error('Error executing query:', err.stack);
      })
      .finally(() => {
        client.release();  // Giải phóng kết nối sau khi truy vấn xong
      });
  })
  .catch(err => {
    console.error('Error connecting to database:', err.stack);
  });*/

module.exports = pool;