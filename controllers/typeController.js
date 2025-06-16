const Loaisan = require('../model/Type');

const getAllType = async (req, res) => {
  try {
    const loaisan = await Loaisan.find();
    res.status(200).json(loaisan);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

module.exports = {
  getAllType
};
