const pool = require('../config/db');
const { AppError } = require('../middlewares/errorMiddleware');

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private (Admin only)
const createRestaurant = async (req, res, next) => {
  try {
    const { name, location, cuisine, description, price_range, address, phone, email, opening_hours } = req.body;

    if (!name || !location || !cuisine) {
      throw new AppError('Please provide all required restaurant details', 400);
    }

    const result = await pool.query(
      `INSERT INTO restaurants 
       (name, location, cuisine, description, price_range, address, phone, email, opening_hours) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [name, location, cuisine, description, price_range, address, phone, email, opening_hours]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY created_at DESC');
    
    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw new AppError('Restaurant not found', 404);
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Admin only)
const updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location, cuisine, description, price_range, address, phone, email, opening_hours } = req.body;

    const result = await pool.query(
      `UPDATE restaurants 
       SET name = $1, location = $2, cuisine = $3, description = $4, 
           price_range = $5, address = $6, phone = $7, email = $8, 
           opening_hours = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 
       RETURNING *`,
      [name, location, cuisine, description, price_range, address, phone, email, opening_hours, id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Restaurant not found', 404);
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Admin only)
const deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM restaurants WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      throw new AppError('Restaurant not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant
};
