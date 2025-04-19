const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  adminLogin,
  adminLogout,
  getAdminProfile
} = require('../controllers/adminController');

// Public routes
router.post('/login', adminLogin);
router.post('/logout', adminLogout);

// Protected routes
router.get('/profile', protect, admin, getAdminProfile);

// Get admin dashboard stats
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    // In a real app, you'd fetch actual statistics here
    res.json({
      message: 'Welcome to Admin Dashboard',
      stats: {
        totalUsers: 100,
        totalRestaurants: 50,
        totalOrders: 200,
        revenue: 50000
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Manage users (admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    // In a real app, you'd fetch users from database
    res.json({
      message: 'User management endpoint',
      users: [
        { id: 1, name: 'User 1', email: 'user1@example.com', role: 'user' },
        { id: 2, name: 'User 2', email: 'user2@example.com', role: 'user' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Manage restaurants (admin only)
router.get('/restaurants', protect, admin, async (req, res) => {
  try {
    // In a real app, you'd fetch restaurants from database
    res.json({
      message: 'Restaurant management endpoint',
      restaurants: [
        { id: 1, name: 'Restaurant 1', status: 'active' },
        { id: 2, name: 'Restaurant 2', status: 'pending' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
});

module.exports = router;