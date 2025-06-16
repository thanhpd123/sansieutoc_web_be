const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema(
  {
    // Nếu bạn muốn có một "mã HLV" riêng (ví dụ: "COACH001"), có thể thêm trường coachId:
    // coachId: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    specialties: [{ type: String }],      // Ví dụ: ["Fitness", "Yoga", ...]
    pricePerHour: { type: Number, required: true },
    description: { type: String },
    availableTimes: [{ type: String }],    // Ví dụ: ["Mon 08:00-10:00", "Wed 14:00-16:00"]
    rating: { type: Number, default: 0 },
    image: { type: String },               // <-- Trường mới: lưu URL hoặc đường dẫn tới ảnh của HLV
    createdAt: { type: Date, default: Date.now }
  },
  {
    // Khi chuyển document thành JSON, Mongoose sẽ tự động include các virtuals (nếu có)
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Tạo virtual field "id" tương đương với "_id"
coachSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('Coach', coachSchema);
