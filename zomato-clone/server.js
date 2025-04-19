const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db'); // 📦 Import the pool

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Add user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Add restaurant routes
const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api/restaurants', restaurantRoutes);

// Add auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Add admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Zomato Clone Backend Running Successfully!');
});

// Test DB connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL Database ✅'))
  .catch(err => console.error('Database Connection Error ❌', err.stack));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
