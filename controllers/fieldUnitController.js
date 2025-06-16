const FieldUnit = require("../model/FieldUnit");

// Lấy tất cả FieldUnit
exports.getAllFieldUnits = async (req, res) => {
  try {
    const units = await FieldUnit.find().populate("fieldId");
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy FieldUnit theo fieldId (tất cả sân con của 1 sân lớn)
exports.getUnitsByFieldId = async (req, res) => {
  try {
    const units = await FieldUnit.find({ fieldId: req.params.fieldId });
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo mới FieldUnit
exports.createFieldUnit = async (req, res) => {
  try {
    const { fieldId, unitNumber, isAvailable } = req.body;
    const unit = new FieldUnit({ fieldId, unitNumber, isAvailable });
    await unit.save();
    res.status(201).json(unit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật trạng thái sân con
exports.updateFieldUnit = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const unit = await FieldUnit.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );
    if (!unit) return res.status(404).json({ error: "Không tìm thấy sân con" });
    res.json(unit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa sân con
exports.deleteFieldUnit = async (req, res) => {
  try {
    const unit = await FieldUnit.findByIdAndDelete(req.params.id);
    if (!unit) return res.status(404).json({ error: "Không tìm thấy sân con" });
    res.json({ message: "Đã xóa sân con" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};