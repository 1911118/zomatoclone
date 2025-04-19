const db = require('../config/db');

// Validate input helper
const validateRestaurantInput = ({ name, address, city, image }) => {
  if (!name || !address || !city || !image) {
    throw new Error('All fields (name, address, city, image) are required');
  }
};

// Create a new restaurant
exports.createRestaurant = async (req, res, next) => {
  try {
    validateRestaurantInput(req.body);
    const { name, address, city, image } = req.body;
    const result = await db.query(
      'INSERT INTO restaurants (name, address, city, image) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, address, city, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error); // Pass error to centralized error handler
  }
};

// Update an existing restaurant
exports.updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateRestaurantInput(req.body);
    const { name, address, city, image } = req.body;
    const result = await db.query(
      'UPDATE restaurants SET name=$1, address=$2, city=$3, image=$4 WHERE id=$5 RETURNING *',
      [name, address, city, image, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM restaurants WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, email, phone, address FROM users ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};