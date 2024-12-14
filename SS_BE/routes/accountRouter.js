const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const middleware = require("../middleware")

router.use('/', middleware.authenticate);
// Define routes
router.get('/profile', accountController.getProfile);
router.put('/profile', accountController.updateProfile);
router.put('/password', accountController.changePassword);
router.get('/reservations', accountController.getReservations);
router.get('/feedbacks', accountController.getFeedbackHistory);
router.get('/favourites', accountController.getFavouriteFields);

module.exports = router;
