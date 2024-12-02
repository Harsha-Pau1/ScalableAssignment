const jwt = require('jsonwebtoken');
const User = require('../../user-service/models/userModel');

const authenticate = (req, res, next) => {
  // Extract token from the Authorization header (Bearer token)
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
      // Verify the JWT token using the secret key
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the user info to the request object (req.user)
      req.user = verified;

      next(); // Proceed to the next middleware or route handler
  } catch (err) {
      return res.status(400).json({ message: 'Invalid token' });
  }
};

// Middleware to check if the user is the same user or an admin
const authorizeStudentOrAdmin = (req, res, next) => {
  const userId = req.user.userId;
  const userRole = req.user.role;
  const requestedUserId = req.params.userId;

  if (userRole === 'admin' || userId === requestedUserId) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Only the same user or an admin can access this resource.' });
  }
};

// Middleware to check if the user is an admin
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeStudentOrAdmin,
  authorizeAdmin
};