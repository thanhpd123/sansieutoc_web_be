// controller/upload.controller.js
const multer = require('multer');
const path = require('path');

// Cấu hình lưu file vào public/images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('image');

// Controller xử lý upload
const uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Lỗi upload:", err);
      return res.status(500).json({ message: 'Lỗi upload ảnh' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    const imagePath = `/images/${req.file.filename}`;
    res.status(200).json({ imageUrl: imagePath });
  });
};

module.exports = {
  uploadImage
};
