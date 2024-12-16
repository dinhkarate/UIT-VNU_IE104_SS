const db = require("../config/db");

function authModel () {};

authModel.getUser = () => {
    const sql = `
    SELECT * FROM customers`;

    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


authModel.newUser = (data, callback) => {
    const sql = `
    INSERT INTO customers (cust_id, first_name, last_name, username, password, phone, email, signup_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;//xóa luôn cust_id với $8 sau khi cập nhật DB

    const params = [
        data.cust_id,// Dòng này lúc sau làm theo DB đã được cập nhật thì xóa vì cái này sẽ tự tạo tăng dần trong DB(tui để đây là do DB của tui  chưa cập nhật)
        data.first_name,
        data.last_name,
        data.username,
        data.password,
        data.phone,
        data.email,
        data.signup_date
    ];

    db.query(sql, params, (err, result) => {
        if (err) throw err;
        callback(null, result);
    });
};

module.exports = authModel;