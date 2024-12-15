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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

    const params = [
        data.cust_id,
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