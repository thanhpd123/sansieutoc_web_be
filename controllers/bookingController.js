const Booking = require('../model/Booking');
const Field = require('../model/Field');
const FieldUnit = require('../model/FieldUnit');
require('../model/Field');


// Lấy danh sách đặt sân của người dùng hiện tại
exports.getBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId })
      .populate('fieldId', 'name address')
      .populate('fieldUnitId', 'unitNumber isAvailable')
      .populate('userId', 'name')
      .sort({ date: 1, startTime: 1 })
      .lean();

    return res.status(200).json({ bookings });
  } catch (err) {
    return res.status(500).json({
      message: 'Lỗi server khi lấy danh sách đặt sân',
      error: err.message,
    });
  }
};

// Tạo đặt sân mới
exports.createBooking = async (req, res) => {
  try {
    const { fieldId, fieldUnitId, date, startTime, endTime, totalPrice } = req.body;
    const userId = req.user._id;

    // Kiểm tra trùng khung giờ đã đặt trên cùng FieldUnit
    const isConflict = await Booking.findOne({
      fieldId,
      fieldUnitId,
      date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
      status: { $ne: 'cancelled' },
    });

    if (isConflict) {
      return res.status(409).json({
        message: 'Khung giờ này đã có người đặt!',
      });
    }

    // Tạo đặt sân
    const newBooking = await Booking.create({
      fieldId,
      fieldUnitId,
      userId,
      date,
      startTime,
      endTime,
      totalPrice,
      status: 'pending',
    });

    // Lấy lại bản ghi có populate
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('fieldId', 'name address')
      .populate('fieldUnitId', 'unitNumber isAvailable')
      .populate('userId', 'name')
      .lean();

    return res.status(201).json({
      message: 'Đặt sân thành công',
      booking: populatedBooking,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({
        message: 'Dữ liệu đặt sân không hợp lệ',
        errors,
      });
    }

    return res.status(500).json({
      message: 'Lỗi server khi tạo đặt sân',
      error: err.message,
    });
  }
};

// Lấy lịch đặt sân theo fieldId và date
exports.getScheduleByField = async (req, res) => {
  try {
    const { fieldId, date } = req.query;

    if (!fieldId?.trim() || !date?.trim()) {
      return res.status(400).json({ message: "Thiếu fieldId hoặc date" });
    }

    const bookings = await Booking.find({ fieldId, date })
      .populate("fieldUnitId", "unitNumber isAvailable")
      .populate("userId", "name phone")
      .sort({ startTime: 1 })
      .lean();

    return res.status(200).json({
      fieldId,
      date,
      bookings,
    });
  } catch (err) {
    console.error("Lỗi khi lấy lịch đặt sân:", err);
    return res.status(500).json({
      message: "Lỗi server khi lấy lịch đặt sân",
      error: err.message,
    });
  }
};


exports.getScheduleByOwner = async (req, res) => {
  try {
    const ownerId = req.user._id;
    console.log("ownerId:", ownerId); 

    const fields = await Field.find({ ownerId });
    console.log("Fields:", fields); 

    const fieldIds = fields.map(f => f._id);
    console.log("fieldIds:", fieldIds); 

    if (fieldIds.length === 0) {
      return res.json([]);
    }

    const bookings = await Booking.find({ fieldId: { $in: fieldIds } })
      .populate("fieldId", "name address")
      .populate('fieldUnitId')
      .populate("userId", "name");

    console.log("Bookings:", bookings); 

    res.json(bookings);
  } catch (err) {
    console.error("getScheduleByOwner error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};



// Lấy danh sách sân con (FieldUnit) của một sân lớn (Field) kèm trạng thái trống/đã đặt theo ngày, giờ
exports.getAvailableFieldUnits = async (req, res) => {
  try {
    const { fieldId, date, startTime, endTime } = req.query;
    if (!fieldId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Thiếu tham số" });
    }

    // Lấy tất cả FieldUnit của Field
    const fieldUnits = await FieldUnit.find({ fieldId }).lean();

    // Lấy các booking đã đặt trùng khung giờ
    const bookedUnits = await Booking.find({
      fieldId,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ],
      status: { $ne: 'cancelled' }
    }).select('fieldUnitId');

    const bookedUnitIds = bookedUnits.map(b => b.fieldUnitId.toString());

    // Đánh dấu sân nào còn trống
    const result = fieldUnits.map(unit => ({
      ...unit,
      isAvailable: !bookedUnitIds.includes(unit._id.toString())
    }));

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: { $ne: "cancelled" }
    })
      .populate("fieldId", "_id name")
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error("Lỗi khi lấy tất cả bookings:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


exports.getScheduleForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("fieldId", "name address ownerId")
      .populate("fieldUnitId", "unitNumber")
      .populate("userId", "name email")
      .sort({ date: 1, startTime: 1 })
      .lean();

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("Lỗi khi lấy lịch đặt sân cho admin:", err);
    return res.status(500).json({
      message: "Lỗi server khi lấy lịch đặt sân cho admin",
      error: err.message,
    });
  }
};

exports.countTodayBookings = async (req, res) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); 

    const count = await Booking.countDocuments({
      date: todayStr,
      status: { $ne: 'cancelled' } // không tính đơn đã huỷ
    });

    res.status(200).json({ count });
  } catch (err) {
    console.error("Lỗi khi đếm lịch đặt hôm nay:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};