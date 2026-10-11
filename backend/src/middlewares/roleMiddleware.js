/**
 * Role-based authorization middleware
 * @param  {...string} allowedRoles e.g. 'LANDLORD', 'TENANT'
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access denied for role '${req.user.role}'. Required: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};

