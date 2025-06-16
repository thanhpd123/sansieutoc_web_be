const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  fieldUnitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FieldUnit", // Liên kết tới FieldUnit
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    enum: [
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
      "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00", "21:00", "22:00"
    ],
    required: true,
  },
  endTime: {
    type: String,
    enum: [
      "08:00", "09:00", "10:00", "11:00", "12:00",
      "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00", "21:00", "22:00", "23:00"
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);