require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routers
const typeRouter = require('./routes/typeRouter');
const fieldsRouter = require('./routes/fieldsRoutes');
const authRouter = require('./routes/authRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const coachesRouter = require('./routes/coachesRouter');
const coachBooking = require('./routes/coachBookingRoutes');
const fieldUnit = require('./routes/fieldUnitRouters')
const uploadRouter = require('./routes/uploadRoutes');
const reportRouter = require('./routes/reportsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
// CORS: Cho phép frontend truy cập (thay đổi origin nếu cần thiết)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Middleware để phân tích request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (ví dụ: ảnh)
app.use('/images', express.static('public/images'));

// ===== MongoDB Connection =====
const DB_URI = process.env.MONGODB_URI;

mongoose.connect(DB_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Dừng server nếu không kết nối được DB
  });

// ===== Routes =====
app.use('/type', typeRouter);
app.use('/field', fieldsRouter);
app.use('/auth', authRouter);
app.use('/booking', bookingRouter);
app.use('/coach', coachesRouter);
app.use('/coachbooking', coachBooking);
app.use('/fieldunit', fieldUnit)
app.use('/upload', uploadRouter);
app.use('/report', reportRouter);
// ===== Global Error Handling Middleware =====
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack);
  res.status(500).json({ message: 'Server error xảy ra, vui lòng thử lại sau.' });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
