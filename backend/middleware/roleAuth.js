// Role-based authorization middleware
const User = require('../models/User');

/**
 * Middleware to check if user has required role/userType
 * Usage: router.get('/route', auth, requireRole('farmer'), handler)
 */
const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user's role matches any of the allowed roles
      if (!allowedRoles.includes(req.user.userType)) {
        console.log(`❌ Access denied: User type ${req.user.userType} not in ${allowedRoles.join(', ')}`);
        return res.status(403).json({
          success: false,
          message: `Access denied. This resource is only available to ${allowedRoles.join(' or ')} users.`,
          userType: req.user.userType,
          requiredType: allowedRoles
        });
      }

      console.log(`✅ Role check passed: ${req.user.userType} accessing ${allowedRoles.join('/')} resource`);
      next();
    } catch (error) {
      console.error('Role auth middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

module.exports = { requireRole };
