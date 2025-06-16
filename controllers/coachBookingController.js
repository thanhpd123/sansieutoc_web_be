const CoachBooking = require('../model/CoachBooking');
const Coach = require('../model/Coach');    // Để kiểm tra coach tồn tại (nếu cần)
const User = require('../model/User');      // Để kiểm tra user tồn tại (nếu cần)

// @desc    Tạo booking mới cho coach
// @route   POST /coach-bookings
// @access  Private (user phải login)
exports.createCoachBooking = async (req, res) => {
  try {
    const { coachId, date, startTime, endTime, totalPrice } = req.body;
    const userId = req.user._id; 

   
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({ message: 'Không tìm thấy huấn luyện viên này.' });
    }

  
    const conflict = await CoachBooking.findOne({
      coachId,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ],
      status: { $ne: 'cancelled' }
    });
    if (conflict) {
      return res.status(409).json({ message: 'Khung giờ này đã có người đặt.' });
    }

  
    const newBooking = await CoachBooking.create({
      coachId,
      userId,
      date,
      startTime,
      endTime,
      totalPrice,
      status: 'pending'
    });

    const populated = await CoachBooking.findById(newBooking._id)
      .populate('coachId', 'name specialties pricePerHour image')
      .populate('userId', 'name email')
      .lean();

    return res.status(201).json({
      message: 'Đặt lịch huấn luyện viên thành công',
      booking: populated
    });
  } catch (err) {
    console.error('Error createCoachBooking:', err);
  
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors });
    }
    return res.status(500).json({ message: 'Lỗi server khi tạo booking', error: err.message });
  }
};

exports.getUserCoachBookings = async (req, res) => {
  try {
    const userId = req.user._1d; // Giả sử auth middleware gán req.user
    const bookings = await CoachBooking.find({ userId })
      .populate('coachId', 'name image specialties pricePerHour')
      .sort({ date: -1, startTime: 1 })
      .lean();
    return res.status(200).json({ bookings });
  } catch (err) {
    console.error('Error getUserCoachBookings:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy lịch sử booking', error: err.message });
  }
};

// @desc    Lấy tất cả booking của một coach (dành cho HLV xem lịch của mình)
// @route   GET /coach-bookings/coach
// @access  Private (chỉ coach mới xem được)
exports.getCoachBookings = async (req, res) => {
  try {
    const coachId = req.user._id; // Giả sử auth middleware gán req.user (đây chính là id của coach)
    const bookings = await CoachBooking.find({ coachId })
      .populate('userId', 'name email')
      .sort({ date: -1, startTime: 1 })
      .lean();
    return res.status(200).json({ bookings });
  } catch (err) {
    console.error('Error getCoachBookings:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy booking của coach', error: err.message });
  }
};

// @desc    Hủy hoặc cập nhật trạng thái booking (ví dụ coach confirm/cancel)
// @route   PATCH /coach-bookings/:id/status
// @access  Private (chỉ coach hoặc admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body; // expect 'confirmed' hoặc 'cancelled'

    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
    }

    const booking = await CoachBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy booking.' });
    }

    // Giả sử req.user._id chính là coachId hoặc admin
    if (booking.coachId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật booking này.' });
    }

    booking.status = status;
    await booking.save();
    return res.status(200).json({ message: 'Cập nhật trạng thái thành công', booking });
  } catch (err) {
    console.error('Error updateBookingStatus:', err);
    return res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái', error: err.message });
  }
};
