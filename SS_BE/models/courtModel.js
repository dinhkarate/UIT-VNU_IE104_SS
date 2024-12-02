const db = require("../config/db");


function courtModel () {};


courtModel.getFilteredCourts = ({ filters }, callback) => {
  let sql = `
    SELECT 
      f.field_id,  
      f.field_name, 
      f.price_per_hour, 
      f.open_time, 
      f.close_time, 
      c.coop, 
      (select STRING_AGG(sub.service_name, ', ' ORDER BY sub.service_id) AS services
	 	  FROM  (
      SELECT DISTINCT ON (sl.service_id) 
        sl.service_name, 
        sl.service_id
        FROM  centres ce
	      JOIN centre_service cs ON ce.centre_id = cs.centre_id
	      JOIN service_list sl ON cs.service_id = sl.service_id
	      ORDER BY sl.service_id) sub) AS services,
      COALESCE(AVG(fe.star), 0) AS average_rating 
    FROM 
      fields f
    JOIN 
      centres c ON f.centre_id = c.centre_id
    JOIN 
      centre_service cs ON c.centre_id = cs.centre_id
    JOIN 
      service_list sl ON cs.service_id = sl.service_id
    LEFT JOIN 
      feedbacks fe ON fe.field_id = f.field_id 
    WHERE 1=1
  `
  ;

  const params = [];

  // Filter by `field_type`
  if (filters.fieldType && filters.fieldType.length > 0) {
    sql += ` AND f.field_type IN ('${filters.fieldType.join("','")}')`;
  }

  // Filter by `sport_type`
  if (filters.sport && filters.sport.length > 0) {
    sql += ` AND f.sport_type IN ('${filters.sport.join("','")}')`;
  }

// Filter by `service_name`
  if (filters.amenities && filters.amenities.length > 0) {
    sql += ` 
        AND f.field_id IN (
        SELECT f.field_id
        FROM fields f
        JOIN centre_service cs ON f.centre_id = cs.centre_id
        JOIN service_list sl ON cs.service_id = sl.service_id
        WHERE sl.service_name IN ('${filters.amenities.join("','")}')
        GROUP BY f.field_id)
    `;
  }

  sql += ` GROUP BY 
    f.field_id, 
    f.field_name, 
    f.price_per_hour, 
    f.open_time, 
    f.close_time, 
    c.coop`;

  db.query(sql, params, (err, results) => {
    // console.log('Query results:', results);
    callback(err, results);
});
};

//Test model court filters
courtModel.getFilteredCourts({ 
  filters: { 
      field_type: ['Sân 7'], 
      sport_type: ['Bóng đá'], 
  }
}, (err, results) => {
  if (err) {
      // console.error('Error fetching courts:', err);
  } else {
      // ('Results:', results);
  }
});


// Lấy chi tiết sân
courtModel.getCourtsDetails = (fieldId, callback) => {
  let sql = `
    SELECT 
      f.field_id,  
      f.field_name, 
      f.price_per_hour, 
      f.open_time, 
      f.close_time, 
      (select STRING_AGG(sub.service_name, ', ' ORDER BY sub.service_id) AS services
	 	  FROM  (
      SELECT DISTINCT ON (sl.service_id) 
        sl.service_name, 
        sl.service_id
        FROM  centres ce
	      JOIN centre_service cs ON ce.centre_id = cs.centre_id
	      JOIN service_list sl ON cs.service_id = sl.service_id
	      ORDER BY sl.service_id) sub) AS services,
      COALESCE(AVG(fe.star), 0) AS average_rating 
    FROM 
      fields f
    JOIN 
      centres c ON f.centre_id = c.centre_id
    JOIN 
      centre_service cs ON c.centre_id = cs.centre_id
    JOIN 
      service_list sl ON cs.service_id = sl.service_id
    LEFT JOIN 
      feedbacks fe ON fe.field_id = f.field_id 
    WHERE 
      f.field_id = $1
    GROUP BY 
      f.field_id, 
      f.field_name, 
      f.price_per_hour, 
      f.open_time, 
      f.close_time
  `;

  const params = [fieldId];

  // console.log(sql);
  // console.log(params);

  db.query(sql, params, (err, results) => {
    // console.log(sql);
    callback(err, results);
  });
};

courtModel.getCentreById = (fieldId, callback) => {
  const sql = `
  SELECT 
  c.centre_id,
  c.description,
  c.coop,
  c.address
  FROM centres c
  JOIN fields f ON c.centre_id = f.centre_id
  WHERE f.field_id = $1
  `
const params = [fieldId];

db.query(sql, params, (err, results) =>{
  //console.log('Query results:', results);
  callback(err, results);
});
};

// Lấy danh sách feedback
courtModel.getFeedbacksById = (fieldId, callback) => {
  const sql = `
      SELECT 
          fb.feedback_id,
          fb.star,
          fb.created_at,
          fb.description,
          c.username
      FROM 
          feedbacks fb
      JOIN 
          customers c ON fb.cust_id = c.cust_id
      WHERE 
          fb.field_id = $1
      ORDER BY 
          fb.created_at DESC;
  `;
  // console.log('Executing SQL:', sql);

  const params = [fieldId]

  // console.log('Executing Params:', params);
  db.query(sql, params, (err, results) => {
    // console.log('Query results 2:', results);
    callback(err, results);
  });
};

/*Received id: { id: { field_id: [ 'BD002' ] } }
// Testing functions
courtModel.getFeedbacksById({id:{field_id: ['BD002'],}}, (err, results) => {
  if (err) {
    console.error('Error fetching court details:', err);
  } else {
    console.log('Court Details:', results);
  }
});*/

courtModel.insertReservation = (details, callback) => {
  const sql = `
    INSERT INTO reservation (resrv_id, time_begin, time_end, resrv_date, renting_price, created_date, field_id, cust_id, resrv_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
  `;

  const params = [
    details.resrv_id,
    details.time_begin,
    details.time_end,
    details.resrv_date,
    details.renting_price,
    details.created_date,
    details.field_id,
    details.cust_id,
    details.resrv_status]

  db.query(sql, params, (err, results) => {
    console.log('Results', results);
    callback(err, results);
  });
};

// Testing functions
courtModel.insertReservation(details = {
  resrv_id: "RSV11", 
  time_begin: "10:00", 
  time_end: "12:00",
  resrv_date: "2024-12-01", 
  renting_price: 100.0,
  created_date: "2024-11-30", 
  field_id: "BD001", 
  cust_id: "CUS01", 
  resrv_status: "confirmed" 
}, (err, results) => {
  if (err) {
      console.error('Error fetching courts:', err);
  } else {
      console.log('Insert thành công');
  }
});

module.exports = courtModel;

