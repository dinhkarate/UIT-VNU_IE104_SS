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
  // Nhận mảng các khoảng thời gian từ request body
  const reservations = req.body.reservations;  // Một mảng các object

  // Kiểm tra nếu reservations không phải là mảng hoặc rỗng
  if (!Array.isArray(reservations) || reservations.length === 0) {
    return res.status(400).json({ message: 'Invalid input. Reservations should be an array.' });
  }

  // Duyệt qua từng reservation và insert
  let insertPromises = reservations.map(reservation => {
    const data = {
      time_begin: reservation.time_begin,
      time_end: reservation.time_end,
      resrv_date: reservation.resrv_date,
      renting_price: reservation.renting_price,
      created_date: reservation.created_date,
      field_id: reservation.field_id,
      cust_id: reservation.cust_id,
      resrv_status: reservation.resrv_status
    };

    // Gọi model insert cho từng reservation
    return new Promise((resolve, reject) => {
      models.court.insertReservation(data, (err) => {
        if (err) {
          console.error('Error inserting reservation:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  // Chờ tất cả các promise được resolve
  Promise.all(insertPromises)
    .then(() => {
      console.log('All reservations inserted successfully');
      res.status(200).json({ message: 'Đặt sân thành công!' });
    })
    .catch(err => {
      console.error('Error inserting reservations:', err);
      res.status(500).json({ message: err.message || 'Internal Server Error' });
    });
};


courtsController.addFavorCourt = (req, res) => {
  const data = {
    cust_id: req.body.cust_id,
    field_id: req.body.field_id
  }

  console.log(data);

  models.court.addFavorCourt(data, (err) => {
    if (err) {
      console.error('Error inserting reservation:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log('Insert thành công');
    res.status(200).json({ message: 'Thêm sân yêu thích thành công!' });
  });
}

courtsController.delFavorCourt = (req, res) => {
  const data = {
    cust_id: req.body.cust_id,
    field_id: req.body.field_id
  }

  console.log(data);

  models.court.delFavorCourt(data, (err) => {
    if (err) {
      console.error('Error inserting reservation:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log('Xóa sân yêu thích thành công');
    res.status(200).json({ message: 'Xóa sân yêu thích thành công!' });
  });
}

module.exports = courtsController;
