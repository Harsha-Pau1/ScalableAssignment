const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Verified Payload:', verified);

        req.user = verified;
        next();
    } catch (err) {
        console.error('Token Verification Error:', err.message);
        return res.status(498).json({ message: 'Invalid token or Expired token' });
    }
};

// Role-based authorization middleware (Admin only)
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next(); // User is authorized, proceed to the next middleware/handler
};

// Role-based authorization middleware (User only)
const authorizeUser = (req, res, next) => {
    if (req.user.role !== 'Student') {
        return res.status(403).json({ message: 'Access denied: Users only' });
    }
    next(); // User is authorized, proceed to the next middleware/handler
};

// Middleware to check if the user is the same student or an admin
const authorizeStudentOrAdmin = (req, res, next) => {

    const userId = req.user.userId;
    const userRole = req.user.role;
    const requestedUserId = req.params.id;
    if (userRole === 'admin' || userId === requestedUserId) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Only the same student or an admin can access this resource.' });
    }
  };

// Export both authentication and authorization middlewares
module.exports = {
    authenticateToken,
    authorizeAdmin,
    authorizeUser,
    authorizeStudentOrAdmin
};