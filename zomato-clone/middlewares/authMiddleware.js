const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and is properly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Authorization header missing or improperly formatted' });
  }

  const token = authHeader.split(' ')[1];

  // Validate the token format
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Invalid Token Format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token payload to the request object
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const admin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { protect, admin };