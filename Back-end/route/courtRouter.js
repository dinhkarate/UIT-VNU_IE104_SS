const express = require('express');
const router = express.Router();
const courtsController = require('../controllers/courtsController');

// Định nghĩa route để lấy danh sách sân chơi và dịch vụ
router.get('/courtsList', courtsController.getCourts);

module.exports = router;
