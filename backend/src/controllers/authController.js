
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: 'fail', message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
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
