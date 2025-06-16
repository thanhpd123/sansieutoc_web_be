const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/allowRoles");



// ...existing code...
router.get("/", authMiddleware, bookingController.getBookings);
router.post("/", authMiddleware, bookingController.createBooking);

// Bỏ authMiddleware ở route này để ai cũng lấy được lịch đặt sân
router.get("/schedule", bookingController.getScheduleByField);

// Lịch đặt sân riêng cho chủ sân (manager xem tất cả lịch của sân mình quản lý)
router.get("/owner", authMiddleware, allowRoles("manager"), bookingController.getScheduleByOwner);

// Admin xem toàn bộ booking
router.get("/admin", authMiddleware, allowRoles("admin"), bookingController.getScheduleForAdmin);

router.get("/admin/bookings", authMiddleware, allowRoles("admin"), bookingController.getAllBookings);

router.get("/today-count", authMiddleware, allowRoles("admin"), bookingController.countTodayBookings);





module.exports = router;
