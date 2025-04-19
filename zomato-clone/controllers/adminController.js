const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { AppError } = require('../middlewares/errorMiddleware');

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'admin']);
  
  if (result.rows.length === 0) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const admin = result.rows[0];
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({
    success: true,
    message: 'Admin Login Successful!',
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  });
};

const adminLogout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

const getAdminProfile = async (req, res, next) => {
  try {
    const adminResult = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1 AND role = $2',
      [req.user.id, 'admin']
    );

    if (adminResult.rows.length === 0) {
      throw new AppError('Admin not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        admin: adminResult.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  getAdminProfile
};