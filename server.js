/**
 * ============================================================================
 * Sweta Kadam — Portfolio Backend Server
 * Express + Mongoose + Local MongoDB Contact Form Storage
 * ============================================================================
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_sweta';

// 1. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// 2. Connect to Local MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('---------------------------------------------------------');
    console.log('✅ Successfully connected to Local MongoDB:');
    console.log(`   URI: ${MONGODB_URI}`);
    console.log('---------------------------------------------------------');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// 3. Contact Message Mongoose Schema & Model
const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [3000, 'Message cannot exceed 3000 characters']
  },
  ip: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// 4. API Endpoints

// Health Check API
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      state: states[dbState] || 'Unknown',
      connected: dbState === 1
    }
  });
});

// POST /api/contact - Store Contact Form Submission into MongoDB
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields: name, email, and message.'
      });
    }

    // Save to Local MongoDB
    const newMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
      userAgent: req.headers['user-agent'] || ''
    });

    const savedMessage = await newMessage.save();

    console.log(`📥 [MongoDB] New Contact Submission Saved! ID: ${savedMessage._id} | From: ${savedMessage.name} <${savedMessage.email}>`);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been stored in MongoDB successfully.',
      data: {
        id: savedMessage._id,
        name: savedMessage.name,
        email: savedMessage.email,
        createdAt: savedMessage.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error saving contact message to MongoDB:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while saving your message to the database.',
      details: error.message
    });
  }
});

// GET /api/contact - Retrieve Stored Messages (for admin / verification)
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({
      success: true,
      count: messages.length,
      messages: messages
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve messages from MongoDB.'
    });
  }
});

// Fallback Route for Single Page App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 5. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio Full Stack Server running at: http://localhost:${PORT}`);
  console.log(`📡 Contact Form API available at: http://localhost:${PORT}/api/contact`);
});
