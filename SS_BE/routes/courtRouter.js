const express = require('express');
const router = express.Router();
const courts = require('../controllers/courtsController');

// Define the route to fetch filtered courts
router.get('/courtsList', courts.getCourts);
router.get('/courtDetails', courts.getCourtWithFeedback);
router.post('/addResrv', courts.insertResrv);
router.post('/addFavor', courts.addFavorCourt);
router.post('/delFavor', courts.delFavorCourt);

module.exports = router;
