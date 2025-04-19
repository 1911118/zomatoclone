const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Admin - Manage Restaurants
router.post('/restaurants', protect, admin, adminController.createRestaurant);
router.put('/restaurants/:id', protect, admin, adminController.updateRestaurant);
router.delete('/restaurants/:id', protect, admin, adminController.deleteRestaurant);

// Admin - Manage Users
router.get('/users', protect, admin, adminController.getAllUsers);

module.exports = router;