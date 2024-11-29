const express = require('express');
const router = express.Router();
const site = require('../controllers/siteController');

// Define the route to fetch filtered courts
router.get('/', site.getAllCourts);

module.exports = router;