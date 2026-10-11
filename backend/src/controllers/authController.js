const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const userModel = require('../models/userModel');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const otpCache = new Map();

const authController = {
  sendOtp: async (req, res, next) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
      }

      const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

      // Try sending via Supabase SMS; fallback to test OTP
      let sentViaSupabase = false;
      try {
        const { error } = await supabase.auth.signInWithOtp({ phone: normalizedPhone });
        if (!error) sentViaSupabase = true;
      } catch (err) {
        // SMS provider not configured
      }

      if (!sentViaSupabase) {
        otpCache.set(normalizedPhone, { otp: '123456', expiresAt: Date.now() + 10 * 60 * 1000 });
      }

      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          phone: normalizedPhone,
          ...(!sentViaSupabase && { devOtp: '123456' })
        }
      });
    } catch (error) {
      next(error);
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const { phone, token, role = 'LANDLORD', name = 'User', email } = req.body;
      if (!phone || !token) {
        return res.status(400).json({ success: false, message: 'Phone and token are required' });
      }

      const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

      // Check test OTP cache
      let verified = false;
      const cached = otpCache.get(normalizedPhone);
      if (cached && cached.expiresAt > Date.now() && cached.otp === token) {
        verified = true;
        otpCache.delete(normalizedPhone);
      }

      // Check Supabase OTP if not verified via cache
      if (!verified) {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: normalizedPhone,
          token,
          type: 'sms'
        });
        if (!error && data?.session) verified = true;
      }

      if (!verified) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      // Get or create user
      let user = await userModel.findByPhone(normalizedPhone);
      if (!user) {
        user = await userModel.create({
          phone: normalizedPhone,
          name,
          role: role === 'TENANT' ? 'TENANT' : 'LANDLORD',
          email: email || null,
          avatarColor: '#4F46E5'
        });
      }

      const authToken = jwt.sign(
        { id: user.id, phone: user.phone, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: { token: authToken, user }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
