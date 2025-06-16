const mongoose = require("mongoose");

// Mỗi FieldUnit là 1 sân con
const fieldUnitSchema = new mongoose.Schema({
  fieldId: { // Liên kết tới sân lớn
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true
  },
  unitNumber: { // Số thứ tự sân con trong sân lớn
    type: Number,
    required: true
  },
  isAvailable: { // true: trống, false: đã được đặt (có thể bỏ nếu xác định động qua booking)
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("FieldUnit", fieldUnitSchema);