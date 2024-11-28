const express = require('express');
const router = express.Router();
const courtsController = require('../controllers/courtsController');

// Define the route to fetch filtered courts
router.get('/courtsList', courtsController.getCourts);

module.exports = router;
