const db = require("../config/db");

function courtModel () {};

courtModel.getFilteredCourts = ({ filters }, callback) => {
  // Xây dựng câu truy vấn SQL
  let sql = `
    SELECT 
      f.field_name, 
      f.price_per_hour, 
      f.open_time, 
      f.close_time, 
      c.coop, 
      GROUP_CONCAT(sl.service_name) AS services
    FROM 
      fields f
    JOIN 
      centres c ON f.centre_id = c.centre_id
    JOIN 
      centre_service cs ON c.centre_id = cs.centre_id
    JOIN 
      service_list sl ON cs.service_id = sl.service_id
    WHERE 1=1
  `;

  const params = [];

  // Thêm điều kiện lọc `field_type`
  if (filters.field_type && filters.field_type.length > 0) {
    sql += ` AND f.field_type IN (${filters.field_type.map(() => '?').join(', ')})`;
    params.push(...filters.field_type);
  }

  // Thêm điều kiện lọc `sport_name`
  if (filters.sport_name && filters.sport_name.length > 0) {
    sql += ` AND f.sport_type IN (${filters.sport_name.map(() => '?').join(', ')})`;
    params.push(...filters.sport_name);
  }

  // Thêm điều kiện lọc `service_name`
  if (filters.service_name && filters.service_name.length > 0) {
    sql += ` AND sl.service_name IN (${filters.service_name.map(() => '?').join(', ')})`;
    params.push(...filters.service_name);
  }

  // Nhóm theo field_id
  sql += ` GROUP BY f.field_id`;

  // Thực thi truy vấn
  db.query(sql, params, (err, result) => {
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

