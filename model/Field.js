const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Id chủ sân, liên kết bảng users
  name: { type: String, required: true },           // Tên sân
  type: { type: mongoose.Schema.Types.ObjectId, ref: "Type", required: true },         // Loại sân (bóng đá, cầu lông,...)
  address: { type: String, required: true },        // Địa chỉ sân
  description: { type: String },                     // Mô tả sân
  pricePerHour: { type: Number, required: true },   // Giá thuê theo giờ
  images: [{ type: String }],                        // Mảng chứa đường dẫn hình ảnh
  availableTimes: [{ type: String }],                // Mảng thời gian có sẵn (ví dụ: ["08:00-10:00", "14:00-16:00"])
}, {
  timestamps: true // Tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model("Field", fieldSchema);
