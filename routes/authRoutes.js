const express = require("express");
const router = express.Router();
const { register, login, getAllUsers, getUsersByRole } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/allowRoles");
const { countManagers } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, allowRoles("admin"), getAllUsers);
router.get("/users", authMiddleware, allowRoles("admin"), getUsersByRole);
router.get("/count/manager", authMiddleware, allowRoles("admin"), countManagers);

module.exports = router;
