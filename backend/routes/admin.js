const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Initialize default admin if none exists
const initializeAdmin = async () => {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const defaultAdmin = new Admin({
      username: 'admin123',
      password: 'smartbank@321'
    });
    await defaultAdmin.save();
    console.log('Default admin created: admin123 / smartbank@321');
  }
};

initializeAdmin();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log(`   [ERROR] Login failed: User '${username}' not found`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      console.log(`   [ERROR] Login failed: Invalid password for '${username}'`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`   [SUCCESS] Login successful: ${username}`);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('   [ERROR] Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get admin info (protected)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ admin });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;


