const models = require('../models');

function courtsController () {};
courtsController.getCourts = (req, res) => {
  const filters = {
    fieldType: req.query.fieldType ? req.query.fieldType.split(',') : [],
    sport: req.query.sport ? req.query.sport.split(',') : [],
    amenities: req.query.amenities ? req.query.amenities.split(',') : []
  };

    // Log filters để debug 
    // console.log('Received filters:', filters);

  models.court.getFilteredCourts({ filters }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    // console.log("Query Results:", results);
    res.status(200).json(results);
  });
};


courtsController.getCourtWithFeedback = (req, res) => {
  const fieldId = req.query.fieldId;
  // Gọi Model để lấy chi tiết sân
  models.court.getCourtsDetails(fieldId, (err1, courtData) => {
      if (err1) {
          return res.status(500).json({ message: 'Error fetching field details', error: err1 });
      }
      
  // Gọi Model để lấy danh sách feedback
  models.court.getFeedbacksById(fieldId, (err2, feedbacksData) => {
      if (err2) {
          return res.status(500).json({ message: 'Error fetching feedbacks', error: err2 });
      }
  
  //Gọi Model lấy thông tin Centre
  models.court.getCentreById(fieldId, (err3, centreData) => {
      if (err3) {
          return res.status(500).json({ message: 'Error fetching centres details', error: err3 });
      }

      // Trả về dữ liệu kết hợp
      const results = {
        courtDetails: courtData,
        feedbacks: feedbacksData,
        centreDetails: centreData,
        };

      res.status(200).json(results);
      });
    });
  });
};

courtsController.insertResrv = (req, res) => {
  const details = {
    resrv_id: req.body.resrv_id,
    time_begin: req.body.time_begin,
    time_end: req.body.time_end,
    resrv_date: req.body.resrv_date,
    renting_price: req.body.renting_price,
    created_date: req.body.created_date,
    field_id: req.body.field_id,
    cust_id: req.body.cust_id,
    resrv_status: req.body.resrv_status
  }

  models.court.insertReservation(details, (err) => {
    if (err) {
      console.error('Error inserting reservation:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log('Insert thành công');
    res.status(200).json({ message: 'Reservation inserted successfully' });
  });
}

module.exports = courtsController;
