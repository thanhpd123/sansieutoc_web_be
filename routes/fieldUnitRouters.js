const express = require("express");
const router = express.Router();
const fieldUnitController = require("../controllers/fieldUnitController");

// Lấy danh sách tất cả sân con
router.get("/", fieldUnitController.getAllFieldUnits);

// Lấy danh sách sân con theo ID sân lớn
router.get("/field/:fieldId", fieldUnitController.getUnitsByFieldId);

// Tạo mới một sân con
router.post("/", fieldUnitController.createFieldUnit);

// Cập nhật thông tin sân con theo ID
router.put("/:id", fieldUnitController.updateFieldUnit);

// Xóa sân con theo ID
router.delete("/:id", fieldUnitController.deleteFieldUnit);

module.exports = router;