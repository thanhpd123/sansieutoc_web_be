const Coach = require('../model/Coach');

// @desc    Tạo mới một coach
// @route   POST /api/coaches
// @access  Public (hoặc Private nếu bạn yêu cầu authentication)
exports.createCoach = async (req, res) => {
  try {
    // Nếu bạn muốn bắt buộc có một mã HLV riêng (coachId), bạn phải lấy từ req.body.coachId và từng validate
    // const { coachId, name, email, ... } = req.body;

    const {
      name,
      email,
      phone,
      specialties,
      pricePerHour,
      description,
      availableTimes,
      rating
    } = req.body;

    // Check email unique (Mongoose sẽ tự check nếu email đã tồn tại, trả lỗi 11000)
    const newCoach = new Coach({
      name,
      email,
      phone,
      specialties,
      pricePerHour,
      description,
      availableTimes,
      rating
    });

    const savedCoach = await newCoach.save();
    return res.status(201).json(savedCoach);
  } catch (err) {
    console.error('Error createCoach:', err);
    if (err.code === 11000 && err.keyValue?.email) {
      return res.status(400).json({ message: 'Email này đã được sử dụng.' });
    }
    return res.status(500).json({ message: 'Lỗi server khi tạo coach', error: err.message });
  }
};

// @desc    Lấy danh sách tất cả coaches
// @route   GET /api/coaches
// @access  Public
exports.getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find().sort({ createdAt: -1 });
    return res.status(200).json(coaches);
  } catch (err) {
    console.error('Error getAllCoaches:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy coaches', error: err.message });
  }
};

// @desc    Lấy chi tiết một coach theo ID
// @route   GET /api/coaches/:id
// @access  Public
exports.getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: 'Không tìm thấy coach.' });
    }
    return res.status(200).json(coach);
  } catch (err) {
    console.error('Error getCoachById:', err);
    // Nếu ID không đúng định dạng ObjectId, Mongoose có thể ném CastError
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID không hợp lệ.' });
    }
    return res.status(500).json({ message: 'Lỗi server khi lấy coach', error: err.message });
  }
};

// @desc    Cập nhật một coach
// @route   PUT /api/coaches/:id
// @access  Public (hoặc Private nếu bạn yêu cầu authentication)
exports.updateCoach = async (req, res) => {
  try {
    const updateData = req.body;
    // Nếu không muốn cập nhật một số trường (ví dụ: createdAt), có thể loại ra khỏi updateData
    const updatedCoach = await Coach.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedCoach) {
      return res.status(404).json({ message: 'Không tìm thấy coach để cập nhật.' });
    }
    return res.status(200).json(updatedCoach);
  } catch (err) {
    console.error('Error updateCoach:', err);
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors });
    }
    if (err.code === 11000 && err.keyValue?.email) {
      return res.status(400).json({ message: 'Email này đã được sử dụng.' });
    }
    return res.status(500).json({ message: 'Lỗi server khi cập nhật coach', error: err.message });
  }
};

// @desc    Xoá một coach
// @route   DELETE /api/coaches/:id
// @access  Public (hoặc Private nếu bạn yêu cầu authentication)
exports.deleteCoach = async (req, res) => {
  try {
    const deletedCoach = await Coach.findByIdAndDelete(req.params.id);
    if (!deletedCoach) {
      return res.status(404).json({ message: 'Không tìm thấy coach để xoá.' });
    }
    return res.status(200).json({ message: 'Xoá coach thành công.' });
  } catch (err) {
    console.error('Error deleteCoach:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID không hợp lệ.' });
    }
    return res.status(500).json({ message: 'Lỗi server khi xoá coach', error: err.message });
  }
};
