const Booking = require('../model/Booking');
const Field = require('../model/Field');

/**
 * 1. Báo cáo doanh thu theo chủ sân (ownerId)
 */
const getRevenueByOwner = async (req, res) => {
  try {
    const { ownerId, from, to } = req.query;
    if (!ownerId) return res.status(400).json({ message: 'ownerId is required' });

    const ownerFields = await Field.find({ ownerId }, '_id');
    const fieldIds = ownerFields.map(f => f._id);

    const matchStage = {
      fieldId: { $in: fieldIds },
      status: 'pending',
    };

    // So sánh chuỗi ngày nếu có from/to
    if (from && to) {
      matchStage.date = { $gte: from, $lte: to }; // from/to dạng 'YYYY-MM-DD'
    }

    const result = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          bookingCount: { $sum: 1 }
        }
      }
    ]);

    return res.json(result[0] || { totalRevenue: 0, bookingCount: 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * 2. Báo cáo doanh thu theo sân (fieldId)
 */
const getRevenueByField = async (req, res) => {
  try {
    const { ownerId, fieldId, from, to } = req.query;

    let matchStage = {
      status: 'pending',
    };

    if (fieldId) {
      matchStage.fieldId = fieldId;
    } else if (ownerId) {
      const ownerFields = await Field.find({ ownerId }, '_id');
      const fieldIds = ownerFields.map(f => f._id);
      matchStage.fieldId = { $in: fieldIds };
    } else {
      return res.status(400).json({ message: 'ownerId hoặc fieldId là bắt buộc' });
    }

    // ✅ Chỉ so sánh chuỗi (vì field `date` là string)
    if (from && to) {
      matchStage.date = { $gte: from, $lte: to };
    }

    const result = await Booking.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'fields',
          localField: 'fieldId',
          foreignField: '_id',
          as: 'field'
        }
      },
      { $unwind: '$field' },
      {
        $group: {
          _id: '$field._id',
          fieldName: { $first: '$field.name' },
          totalRevenue: { $sum: '$totalPrice' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};




/**
 * 3. Báo cáo doanh thu theo slot
 */
const getRevenueBySlot = async (req, res) => {
  try {
    const { from, to } = req.query;

    const matchStage = {
      status: 'pending',
    };

    if (from && to) {
      matchStage.date = {
        $gte: from,
        $lte: to
      };
    }

    const result = await Booking.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          slot: { $concat: ['$startTime', '-', '$endTime'] }
        }
      },
      {
        $group: {
          _id: '$slot',
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 }
        }
      },
      {
        $project: {
          slot: '$_id',
          totalRevenue: 1,
          totalBookings: 1,
          _id: 0
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json(result);
  } catch (error) {
    console.error('Lỗi lấy doanh thu theo khung giờ:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getMonthlyRevenueComparison = async (req, res) => {
  try {
    const { year, ownerId } = req.query;
    const match = {
      status: "pending",
    };
    if (ownerId) {
      const fields = await Field.find({ ownerId }, "_id");
      match.fieldId = { $in: fields.map(f => f._id) };
    }
    if (year) {
      match.date = {
        $regex: `^${year}-`, // Match YYYY-MM
      };
    }

    const result = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // "YYYY-MM"
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(result);
  } catch (error) {
    console.error("Lỗi so sánh doanh thu tháng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// So sánh doanh thu theo từng năm
const getYearlyRevenueComparison = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const match = {
      status: "pending",
    };
    if (ownerId) {
      const fields = await Field.find({ ownerId }, "_id");
      match.fieldId = { $in: fields.map(f => f._id) };
    }

    const result = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $substr: ["$date", 0, 4] }, // "YYYY"
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(result);
  } catch (error) {
    console.error("Lỗi so sánh doanh thu năm:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};



module.exports = {
  getRevenueByOwner,
  getRevenueByField,
  getRevenueBySlot,
  getMonthlyRevenueComparison,
  getYearlyRevenueComparison
};
