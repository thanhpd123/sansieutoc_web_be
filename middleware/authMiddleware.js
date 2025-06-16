const jwt = require("jsonwebtoken");
const User = require("../model/User"); // Đảm bảo đường dẫn chính xác

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token hoặc token không hợp lệ." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại." });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token đã hết hạn." });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token không hợp lệ." });
    }
    return res.status(500).json({ message: "Lỗi xác thực server.", error: error.message });
  }
};

module.exports = authMiddleware;