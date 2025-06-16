const express = require("express");
const router = express.Router();
const FieldsController = require("../controllers/fieldsController");
const allowRoles = require("../middleware/allowRoles");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", FieldsController.getAllFields);
router.post("/", FieldsController.createFields);
router.get("/admin", authMiddleware, allowRoles("admin"), FieldsController.getAllFieldsAdmin);
router.get("/owner", authMiddleware, allowRoles("manager"), FieldsController.getFieldsByOwner);
router.get('/:id', FieldsController.getFieldById);
router.put("/:id", authMiddleware, allowRoles("manager"), FieldsController.updateField);
router.delete("/:id", authMiddleware, allowRoles("manager"), FieldsController.deleteField);


module.exports = router;
