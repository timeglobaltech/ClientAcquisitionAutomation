require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

connectDB();
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - allow all localhost ports for development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
  credentials: true
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Compression middleware
app.use(compression());

// Logging
app.use(morgan('combined'));

// Parse JSON requests
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running!' });
});

// Import routes
console.log('Loading routes...');
const authRoutes = require('./routes/authRoutes');
const leadsRoutes = require('./routes/leadsRoutes');
const scraperRoutes = require('./routes/scraperRoutes');
console.log('Routes loaded, mounting...');
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/scraper', scraperRoutes);
console.log('Routes mounted successfully!');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Keep server alive
setInterval(() => {}, 1000);
