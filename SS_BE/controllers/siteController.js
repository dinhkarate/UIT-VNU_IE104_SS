const models = require('../models');

function siteController () {};
siteController.getAllCourts = (req, res) => {
    // Log the filters for debugging
  models.site.getCourts((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log("Query Results:", results);
    res.status(200).json(results);
  });
};

module.exports = siteController;