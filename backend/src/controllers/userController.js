const userModel = require('../models/userModel');

const userController = {
  /**
   * Get current user profile
   * GET /api/users/me
   */
  getMe: async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update current user profile
   * PUT /api/users/me
   * Body: { name, email, upiId, avatarColor }
   */
  updateMe: async (req, res, next) => {
    try {
      const { name, email, upiId, avatarColor } = req.body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (upiId !== undefined) updateData.upiId = upiId;
      if (avatarColor !== undefined) updateData.avatarColor = avatarColor;

      const updatedUser = await userModel.update(req.user.id, updateData);

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;

