
const jwt  = require('jsonwebtoken');
const dns  = require('dns').promises;
const User = require('../models/User');

// Check that the email domain has valid MX records
const domainHasMX = async (domain) => {
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Basic field check ──────────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Name, email and password are required' });
    }

    // ── Email format ───────────────────────────────────────────────
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 'fail', message: 'Please enter a valid email address' });
    }

    const domain = email.split('@')[1].toLowerCase();

    // ── Sirf Gmail allowed ─────────────────────────────────────────
    if (domain !== 'gmail.com') {
      return res.status(400).json({
        status: 'fail',
        message: 'Only Gmail addresses (@gmail.com) are allowed to register.'
      });
    }

    // ── MX record check — domain must be able to receive email ─────
    const hasMX = await domainHasMX(domain);
    if (!hasMX) {
      return res.status(400).json({
        status: 'fail',
        message: `The email domain "${domain}" does not appear to be valid. Please use a real email address.`
      });
    }

    // ── Duplicate user check ───────────────────────────────────────
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ status: 'fail', message: 'An account with this email already exists' });
    }

    // ── Create user ────────────────────────────────────────────────
    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password,
    });

    res.status(201).json({
      status: 'success',
      token: generateToken(user._id),
      data: {
        user: {
          id:    user._id,
          name:  user.name,
          email: user.email,
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }

    res.json({
      status: 'success',
      token: generateToken(user._id),
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Update profile (name, email)
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if new email already taken by another user
    if (email) {
      const existing = await User.findOne({ email });
      if (existing && String(existing._id) !== String(req.user._id)) {
        return res.status(400).json({ status: 'fail', message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(email && { email }) },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user: { id: user._id, name: user.name, email: user.email } }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ status: 'fail', message: 'Please provide current and new password' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ status: 'fail', message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ status: 'fail', message: 'Current password is incorrect' });
    }

    // Set new password — pre-save hook will hash it
    user.password = newPassword;
    await user.save();

    res.json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
