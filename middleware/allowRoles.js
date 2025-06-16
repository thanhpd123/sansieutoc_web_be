
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập tài nguyên này." });
    }
    next();
  };
};

module.exports = allowRoles;
