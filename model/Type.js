const mongoose = require('mongoose');

const loaisanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hinhAnh: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Type', loaisanSchema);
