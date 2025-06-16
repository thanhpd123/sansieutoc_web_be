const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

// [POST] /auth/register - Đăng ký người dùng
exports.register = async (req, res) => {
  try {
    console.log("==== req.body ====", req.body); // Kiểm tra dữ liệu nhận được

    const { name, email, password, role, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || "user",
      phone,
      address,
    });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// [POST] /auth/login - Đăng nhập người dùng
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// [GET] /auth/users - Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter).select("-passwordHash");
    res.json(users);
  } catch (error) {
    console.error("Lỗi lấy người dùng theo vai trò:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

exports.countManagers = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "manager" });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Lỗi khi đếm manager:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

