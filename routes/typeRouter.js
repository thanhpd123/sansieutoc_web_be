const express = require('express');
const router = express.Router();
const { getAllType } = require('../controllers/typeController');

router.get('/', getAllType);

module.exports = router;
