const express = require('express');
const router = express.Router();
const {
  createCoach,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach
} = require('../controllers/coachesController');
// Nếu bạn có middleware auth để giới hạn create/update/delete, import tại đây
// const authMiddleware = require('../middleware/auth');

// GET  /api/coaches         → Lấy tất cả coaches
router.get('/', getAllCoaches);

// GET  /api/coaches/:id     → Lấy chi tiết coach bởi ID
router.get('/:id', getCoachById);

// POST /api/coaches         → Tạo mới coach
// Nếu bạn muốn người dùng phải đăng nhập mới tạo, thêm `authMiddleware` vào giữa
router.post('/', /* authMiddleware, */ createCoach);

// PUT  /api/coaches/:id     → Cập nhật coach
// Nếu bạn muốn giới hạn, thêm `authMiddleware` trước controller
router.put('/:id', /* authMiddleware, */ updateCoach);

// DELETE /api/coaches/:id    → Xoá coach
// Nếu bạn muốn giới hạn, thêm `authMiddleware`
router.delete('/:id', /* authMiddleware, */ deleteCoach);

module.exports = router;
