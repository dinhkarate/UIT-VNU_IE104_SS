const express = require('express');
const router = express.Router();
const courts = require('../controllers/courtsController');
const middleware = require("../middleware")

// Define the route to fetch filtered courts
router.get('/courtsList', courts.getCourts);
router.get('/courtDetails', courts.getCourtWithFeedback);
router.post('/addResrv', middleware.authenticate, courts.insertResrv);
router.post('/addFavor', middleware.authenticate, courts.addFavorCourt);
router.post('/delFavor', middleware.authenticate, courts.delFavorCourt);

module.exports = router;
