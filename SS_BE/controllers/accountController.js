const db = require("../config/db"); // Import kết nối tới database
const bcrypt = require("bcrypt"); // Thêm bcrypt để mã hóa mật khẩu (Dòng mới)

function accountController() {}

// Mặc định người gửi request là cust_id = 1
const defaultCustId = 1; // TODO: Thay đổi cust_id khi có logic đăng nhập

// 1. Xem thông tin cá nhân
accountController.getProfile = (req, res) => {
  const sql = `
        SELECT cust_id, first_name, last_name, username, phone, email, signup_date
        FROM customers
        WHERE cust_id = $1
    `;
  const params = [defaultCustId];
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results.rows[0]); // Trả về thông tin cá nhân
  });
};

// 2. Cập nhật thông tin cá nhân
accountController.updateProfile = (req, res) => {
  const { first_name, last_name, phone, email } = req.body;
  const sql = `
        UPDATE customers
        SET first_name = $1, last_name = $2, phone = $3, email = $4
        WHERE cust_id = $5
    `;
  const params = [first_name, last_name, phone, email, defaultCustId];
  db.query(sql, params, (err) => {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json({ message: "Profile updated successfully!" });
  });
};

// 3. Thay đổi mật khẩu (Đã thêm mã hóa bcrypt)
accountController.changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const checkPasswordSql = `
        SELECT password FROM customers WHERE cust_id = $1
    `;
  const updatePasswordSql = `
        UPDATE customers SET password = $1 WHERE cust_id = $2
    `;
  db.query(checkPasswordSql, [defaultCustId], async (err, results) => {
    if (err) {
      console.error("Error verifying password:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const currentPassword = results.rows[0]?.password;

    // So sánh mật khẩu cũ (Bcrypt: Sửa đổi)
    const isMatch = await bcrypt.compare(oldPassword, currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Mã hóa mật khẩu mới (Bcrypt: Sửa đổi)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query(updatePasswordSql, [hashedPassword, defaultCustId], (err) => {
      if (err) {
        console.error("Error changing password:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json({ message: "Password changed successfully!" });
    });
  });
};

// 4. Xem lịch đặt sân
accountController.getReservations = (req, res) => {
  const sql = `
        SELECT f.field_name, r.resrv_date, r.time_begin, r.time_end, r.renting_price, r.resrv_status
        FROM reservation r
        JOIN fields f ON r.field_id = f.field_id
        WHERE r.cust_id = $1
        ORDER BY r.resrv_date DESC, r.time_begin
    `;
  const params = [defaultCustId];
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching reservations:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results.rows);
  });
};

// 5. Xem lịch sử bình luận
accountController.getFeedbackHistory = (req, res) => {
  const sql = `
        SELECT fb.star, fb.created_at, fb.description
        FROM feedbacks fb
        WHERE fb.cust_id = $1
        ORDER BY fb.created_at DESC
    `;
  const params = [defaultCustId];
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching feedback history:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results.rows);
  });
};

// 6. Xem sân yêu thích
accountController.getFavouriteFields = (req, res) => {
  const sql = `
        SELECT f.field_name, f.sport_type, f.price_per_hour, f.centre_id, f.field_type, f.open_time, f.close_time, f.link_img
        FROM favourite_field ff
        JOIN fields f ON ff.field_id = f.field_id
        WHERE ff.cust_id = $1
        ORDER BY f.field_name
    `;
  const params = [defaultCustId];
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching favourite fields:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results.rows);
  });
};

module.exports = accountController;
