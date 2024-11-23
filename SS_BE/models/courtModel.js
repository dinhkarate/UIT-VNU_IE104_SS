const db = require("../config/db");

function courtModel () {};

courtModel.getAllCourt = (callback) => {
    const sql = `
      SELECT 
          f.field_id,
          f.field_name,
          f.price_per_hour,
          f.verfified,
          f.open_time,
          f.close_time,
          fs.service_id,
          sl.service_name
      FROM 
          Fields AS f
      JOIN 
          Field_Service AS fs ON f.field_id = fs.field_id
      JOIN 
          Service_List AS sl ON fs.service_id = sl.service_id;
    `;
  
    db.query(sql, (err, result) => {
      callback(err, result);
    });
  };

courtModel.getInfo = ({id}, callback) => {
    const sql = `
    SELECT * 
    FROM Centre
    WHERE centre_id =?;
    `;

    db.query(sql, (err, result) => {
      callback(err, result);
    });
};




module.exports = courtModel

