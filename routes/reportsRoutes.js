const express = require('express');
const router = express.Router();
const {
  getRevenueByOwner,
  getRevenueByField,
  getRevenueBySlot,
  getMonthlyRevenueComparison,
  getYearlyRevenueComparison,
} = require('../controllers/reportController');
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/allowRoles");


router.get('/owner', authMiddleware, allowRoles("manager", "admin"), getRevenueByOwner);

router.get('/field', authMiddleware, allowRoles("manager", "admin"), getRevenueByField);

router.get('/slot', authMiddleware, allowRoles("manager", "admin"), getRevenueBySlot);

router.get('/month', authMiddleware, allowRoles("manager", "admin"), getMonthlyRevenueComparison);

router.get('/year', authMiddleware, allowRoles("manager", "admin"), getYearlyRevenueComparison);


module.exports = router;
