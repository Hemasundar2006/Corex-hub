// Corex Projects Hub Backend Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./seed/seedData');

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const promotionRoutes = require('./routes/promotions');
const discountRoutes = require('./routes/discount');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*', // Allow Next.js frontend requests
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory (for fallback local uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Corex Projects Hub Backend API',
    theme: 'Peach #D96F4C',
  });
});

// Mount Routes (supporting both /api/... and /api/admin/... patterns)
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/api/admin/products', productRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/admin/categories', categoryRoutes);

app.use('/api/promotions', promotionRoutes);
app.use('/api/admin/promotions', promotionRoutes);

app.use('/api/discount', discountRoutes);
app.use('/api/admin/discount', discountRoutes);

app.use('/api/settings', settingsRoutes);
app.use('/api/admin/settings', settingsRoutes);

// Danger zone: Endpoint to clear the database
app.delete('/api/admin/clear-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      await mongoose.connection.collections[collectionName].deleteMany({});
    }
    res.status(200).json({ success: true, message: 'All database collections have been cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear database.', error: error.message });
  }
});

// Catch 404 for unknown endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    // Auto-seed initial catalogue and admin user if needed
    // await seedDatabase(false);

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Corex Projects Hub REST API running on port ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`✨ Health: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
