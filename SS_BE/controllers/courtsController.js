const models = require('../models');

function courtsController () {};
courtsController.getCourts = (req, res) => {
  const filters = {
    fieldType: req.query.fieldType ? req.query.fieldType.split(',') : [],
    sport: req.query.sport ? req.query.sport.split(',') : [],
    amenities: req.query.amenities ? req.query.amenities.split(',') : []
  };

    // Log the filters for debugging
    console.log('Received filters:', filters);

  models.court.getFilteredCourts({ filters }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log("Query Results:", results);
    res.status(200).json(results);
  });
};

courtsController.getFieldWithFeedback = (req, res) => {
  const fieldId = req.params.fieldId;
  
  // Gọi Model để lấy chi tiết sân
  fieldModel.getFieldDetails(fieldId, (err, fieldDetails) => {
      if (err) {
          return res.status(500).json({ message: 'Error fetching field details', error: err });
      }
      
      // Gọi Model để lấy danh sách feedback
      fieldModel.getFieldFeedbacks(fieldId, (err, feedbacks) => {
          if (err) {
              return res.status(500).json({ message: 'Error fetching feedbacks', error: err });
          }

          // Trả về dữ liệu kết hợp
          res.json({
              fieldDetails,
              feedbacks,
          });
      });
  });
};

module.exports = courtsController;
