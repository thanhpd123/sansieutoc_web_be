const Fields = require("../model/Field");

// Lấy danh sách tất cả các sân, kèm thông tin loại sân
exports.getAllFields = async (req, res) => {
  try {
    const sanList = await Fields.find().populate({
      path: "type",
      select: "name _id",
    });
    res.status(200).json(sanList);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sân:", error);
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error });
  }
};

// Tạo sân mới
exports.createFields = async (req, res) => {
  try {
    const data = req.body;

    // Đảm bảo images là array
    if (!Array.isArray(data.images)) {
      data.images = data.images ? [data.images] : [];
    }
    
    const newSan = new Fields(req.body);
    await newSan.save();
    res.status(201).json(newSan);
  } catch (error) {
    console.error("Lỗi khi thêm sân:", error);
    res.status(400).json({ message: "Lỗi khi thêm sân", error });
  }
};

// Lấy sân theo ID
exports.getFieldById = async (req, res) => {
  try {
    const field = await Fields.findById(req.params.id).populate("type");
    if (!field) {
      return res.status(404).json({ message: "Không tìm thấy sân" });
    }
    res.status(200).json(field);
  } catch (err) {
    console.error("Lỗi khi lấy sân theo ID:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// Lấy danh sách sân theo ownerId (chủ sân)
exports.getFieldsByOwner = async (req, res) => {
  try {
    const fields = await Fields.find({ ownerId: req.user.id }).populate("type");
    res.json(fields);
  } catch (err) {
    console.error("Lỗi khi truy vấn danh sách sân:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


// Xoá sân theo ID
exports.deleteField = async (req, res) => {
  try {
    const field = await Fields.findById(req.params.id);

    if (!field) {
      return res.status(404).json({ message: "Sân không tồn tại" });
    }

    // Kiểm tra quyền xoá (nếu cần): chỉ chủ sân mới được xoá
    if (field.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền xoá sân này" });
    }

    await field.deleteOne();
    res.status(200).json({ message: "Xoá sân thành công" });
  } catch (err) {
    console.error("Lỗi xoá sân:", err);
    res.status(500).json({ message: "Lỗi khi xoá sân", error: err.message });
  }
};


// Cập nhật sân
exports.updateField = async (req, res) => {
  try {
    const field = await Fields.findById(req.params.id);

    if (!field) {
      return res.status(404).json({ message: "Sân không tồn tại" });
    }

    if (field.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Không có quyền sửa sân này" });
    }

    Object.assign(field, req.body);
    await field.save();

    res.status(200).json(field);
  } catch (err) {
    console.error("Lỗi cập nhật sân:", err);
    res.status(500).json({ message: "Lỗi khi cập nhật sân", error: err.message });
  }
};

exports.getAllFieldsAdmin = async (req, res) => {
  try {
    const sanList = await Fields.find()
      .populate({
        path: "type",
        select: "name _id",
      })
      .populate({
        path: "ownerId",
        select: "name",
      });

    res.status(200).json(sanList);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sân:", error);
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error });
  }
};



