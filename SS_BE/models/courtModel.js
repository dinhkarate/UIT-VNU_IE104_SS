const db = require("../config/db");


function courtModel () {}


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
    console.log('Query results:', results);
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
      console.error('Error fetching courts:', err);
  } else {
      console.log('Results:', results);
  }
});

/*
// Lấy chi tiết sân
courtModel.getCourtDetails = ({id}, callback) => {
  const sql = `
      SELECT 
          f.field_id,
          f.field_name,
          f.price_per_hour,
          f.open_time,
          f.close_time,
          c.coop,
          f.field_type,
      	  STRING_AGG(sl.service_name, ', ') AS services
      FROM 
          fields f
      JOIN 
          centres c ON f.centre_id = c.centre_id
      LEFT JOIN 
          centre_service cs ON c.centre_id = cs.centre_id
      LEFT JOIN 
          service_list sl ON cs.service_id = sl.service_id
      WHERE 
          f.field_id = ?
      GROUP BY 
          f.field_id,
          f.field_name,
          f.price_per_hour,
          f.open_time,
          f.close_time,
          c.coop,
          f.field_type;
  `;
  console.log('Executing SQL:', sql);
  const params = [id];
  console.log('Executing Params:', params);
  db.query(sql, params, (err, results) => {
    console.log('Query results:', results[0]);
      callback(err, results[0]); // Trả về chi tiết sân
  });
};

courtModel.getCourtDetails({ id: 'BD002' }, (err, details) => {
  if (err) {
    console.error('Error fetching court details:', err);
  } else {
    console.log('Court Details:', details);
  }
});



// Lấy danh sách feedback
courtModel.getCourtFeedbacks = ({id}, callback) => {
  const sql = `
      SELECT 
          fb.feedback_id,
          fb.star,
          fb.created_at,
          fb.description,
          c.first_name,
          c.last_name
      FROM 
          feedbacks fb
      JOIN 
          customers c ON fb.cust_id = c.cust_id
      WHERE 
          fb.field_id = ?
      ORDER BY 
          fb.created_at DESC;
  `;
  console.log('Executing SQL:', sql);
  const params = [id]
  console.log('Executing Params:', params);
  db.query(sql, params, (err, results) => {
    console.log('Query results 2:', results);
      callback(err, results);
  });
};*/


/* Test model court details and feedbacks 
const testFieldId = 'BD002'; // Replace with a valid field_id

courtModel.getCourtDetails({testFieldId}, (err, details) => {
  if (err) {
    console.error('Error fetching court details:', err);
  } else {
    console.log('Court Details:', details);

    courtModel.getCourtFeedbacks(testFieldId, (err, feedbacks) => {
      if (err) {
        console.error('Error fetching court feedbacks:', err);
      } else {
        console.log('Court Feedbacks:', feedbacks);
      }
    });
  }
});*/


module.exports = courtModel

