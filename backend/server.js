const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n[REQUEST] ${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('   Body:', JSON.stringify(req.body, null, 2));
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('   Query:', req.query);
  }
  next();
});

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/branches', require('./routes/branches'));
app.use('/docs', require('./routes/docs'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'AI Banking Chatbot Backend API', status: 'running' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-banking-chatbot';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Make sure MongoDB is running or update MONGODB_URI in .env');
  });

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

