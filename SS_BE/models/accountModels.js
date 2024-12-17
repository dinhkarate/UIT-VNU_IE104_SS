const db = require("../config/db"); // Import kết nối tới cơ sở dữ liệu

function accountModel() {}

// 1. Lấy thông tin cá nhân
accountModel.getProfile = (custId, callback) => {
  const sql = `
        SELECT cust_id, first_name, last_name, username, phone, email, signup_date
        FROM customers
        WHERE cust_id = $1
    `;
  const params = [custId];
  db.query(sql, params, (err, results) => {
    callback(err, results.rows[0]);
  });
};

// 2. Cập nhật thông tin cá nhân
accountModel.updateProfile = (custId, data, callback) => {
  const sql = `
        UPDATE customers
        SET first_name = $1, last_name = $2, phone = $3, email = $4
        WHERE cust_id = $5
    `;
  const params = [
    data.first_name,
    data.last_name,
    data.phone,
    data.email,
    custId,
  ];
  db.query(sql, params, (err, results) => {
    callback(err, results);
  });
};

// 3. Thay đổi mật khẩu
accountModel.changePassword = (custId, hashedPassword, callback) => {
  const sql = `
        UPDATE customers
        SET password = $1
        WHERE cust_id = $2
    `;
  const params = [hashedPassword, custId]; // Sử dụng mật khẩu đã mã hóa
  db.query(sql, params, (err, results) => {
    callback(err, results);
  });
};

// 4. Lấy lịch đặt sân
accountModel.getReservations = (custId, callback) => {
  const sql = `
        SELECT f.field_name, r.resrv_date, r.time_begin, r.time_end, r.renting_price, r.resrv_status
        FROM reservation r
        JOIN fields f ON r.field_id = f.field_id
        WHERE r.cust_id = $1
        ORDER BY r.resrv_date DESC, r.time_begin
    `;
  const params = [custId];
  db.query(sql, params, (err, results) => {
    callback(err, results.rows);
  });
};

// 5. Lấy lịch sử bình luận
accountModel.getFeedbackHistory = (custId, callback) => {
  const sql = `
        SELECT fb.star, fb.created_at, fb.description
        FROM feedbacks fb
        WHERE fb.cust_id = $1
        ORDER BY fb.created_at DESC
    `;
  const params = [custId];
  db.query(sql, params, (err, results) => {
    callback(err, results.rows);
  });
};

// 6. Lấy sân yêu thích
accountModel.getFavouriteFields = (custId, callback) => {
  const sql = `
        SELECT f.field_name, f.sport_type, f.price_per_hour, f.centre_id, f.field_type, f.open_time, f.close_time, f.link_img
        FROM favourite_field ff
        JOIN fields f ON ff.field_id = f.field_id
        WHERE ff.cust_id = $1
        ORDER BY f.field_name
    `;
  const params = [custId];
  db.query(sql, params, (err, results) => {
    callback(err, results.rows);
  });
};

module.exports = accountModel;
