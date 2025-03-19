const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Token using user-Id and User-role 
const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token or authentication error' });
    }
  };
};

module.exports = auth;
