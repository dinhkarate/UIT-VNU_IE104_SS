const court = require('../models/courtModel');

const courtController = {
  async getCourts(req, res) {
    const filters = {
      field_type: req.query.field_type ? req.query.field_type.split(',') : [],
      sport_name: req.query.sport_name ? req.query.sport_name.split(',') : [],
      service_name: req.query.service_name ? req.query.service_name.split(',') : []
    };

    try {
      const fields = await court.getFilteredCourts(filters);
      res.status(200).json(fields);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching fields', error: error.message });
    }
  }
};

module.exports = fieldController;
