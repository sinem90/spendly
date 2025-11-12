const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
    }

    // Extract token
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again',
      });
    }

    return res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error',
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
    }

    next();
  } catch (error) {
    // Ignore errors for optional authentication
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate,
};
