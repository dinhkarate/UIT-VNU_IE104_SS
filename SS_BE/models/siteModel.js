const db = require("../config/db");


function siteModel () {}


siteModel.getCourts = (callback) => {
  let sql = `
    SELECT 
      f.field_id,  
      f.field_name, 
      f.price_per_hour, 
      f.open_time, 
      f.close_time, 
      f.sport_type,
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

  sql += ` GROUP BY 
    f.field_id, 
    f.field_name, 
    f.price_per_hour, 
    f.open_time, 
    f.close_time, 
    c.coop`;
console.log(sql);
console.log(params);
  db.query(sql, params, (err, results) => {
    console.log('Query results:', results);
    callback(err, results);
});
};

//Test model court filters
siteModel.getCourts((err, results) => {
    if (err) {
        console.error('Error fetching courts:', err);
    } else {
        console.log('Results:', results);
    }
  });

module.exports = siteModel;