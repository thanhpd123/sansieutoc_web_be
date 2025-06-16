const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Route POST /upload
router.post('/', uploadController.uploadImage);

module.exports = router;
