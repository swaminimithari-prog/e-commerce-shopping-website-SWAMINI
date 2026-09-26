// const dns = require('dns');
// dns.setServers(["1.1.1.1", "8.8.8.8"]);

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const morgan = require('morgan');
// const dotenv = require('dotenv');
// dotenv.config();
// const path = require('path');


// const app = express();

// // ─── Middleware ────────────────────────────────────────────────
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ─── Database Connection ───────────────────────────────────────
// mongoose
//   .connect(process.env.MONGO_DB_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err.message);
//     process.exit(1);
//   });

// // ─── Routes ───────────────────────────────────────────────────
// app.use('/api/auth',     require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/cart',     require('./routes/cartRoutes'));
// app.use('/api/orders',   require('./routes/orderRoutes'));
// // app.use('/api/payment',  require('./routes/'));

// // ─── Health Check ─────────────────────────────────────────────
// app.get('/', (req, res) => {
//   res.json({ message: 'E-Commerce API is running 🛒' });
// });

// // ─── Global Error Handler ─────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//   });
// });

// // ─── Start Server ─────────────────────────────────────────────
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');


const app = express();

// ─── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Database Connection ───────────────────────────────────────
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
// app.use('/api/payment',  require('./routes/'));

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce API is running 🛒' });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});