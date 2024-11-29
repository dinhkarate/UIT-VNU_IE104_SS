const express = require('express');
const router = express.Router();
const courts = require('../controllers/courtsController');

// Define the route to fetch filtered courts
router.get('/courtsList', courts.getCourts);

module.exports = router;
