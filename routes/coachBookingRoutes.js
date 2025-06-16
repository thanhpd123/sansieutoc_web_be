const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Giả sử bạn có middleware xác thực JWT
const {
  createCoachBooking,
  getUserCoachBookings,
  getCoachBookings,
  updateBookingStatus
} = require('../controllers/coachBookingController');

// POST   /coach-bookings           → Tạo booking mới (user phải login)
router.post('/', authMiddleware, createCoachBooking);

// GET    /coach-bookings/user      → Lấy lịch sử booking của user hiện tại
router.get('/user', authMiddleware, getUserCoachBookings);

// GET    /coach-bookings/coach     → Lấy lịch booking của coach (coach phải login)
router.get('/coach', authMiddleware, getCoachBookings);

// PATCH  /coach-bookings/:id/status → Cập nhật trạng thái (confirmed/cancelled) (coach hoặc admin)
router.patch('/:id/status', authMiddleware, updateBookingStatus);

module.exports = router;
