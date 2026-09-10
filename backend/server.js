// IoT Garage Backend Server
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
    service: 'IoT Garage Backend API',
    version: '2.0',
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

// Import massive data endpoint
app.post('/api/admin/import-massive', async (req, res) => {
  try {
    const { importMassiveData } = require('./seed/importMassiveData');
    const result = await importMassiveData();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Import failed', error: error.message });
  }
});

// Combined setup: create admin + clear old data + import all products
app.post('/api/admin/setup-production', async (req, res) => {
  try {
    const Admin = require('./models/Admin');
    const Category = require('./models/Category');
    const Product = require('./models/Product');
    const Settings = require('./models/Settings');

    // Clear existing
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create / update admin
    const adminEmail = 'veerapaneniyaswanth5@gmail.com';
    const adminPassword = 'Yashking606171';
    const passwordHash = await Admin.hashPassword(adminPassword);

    await Admin.findOneAndUpdate(
      { email: adminEmail },
      { name: 'IoT Garage Admin', email: adminEmail, passwordHash, role: 'admin' },
      { upsert: true, new: true }
    );
    // Remove old default admin
    await Admin.deleteMany({ email: 'admin@corex.com' });

    // Update store settings
    await Settings.findOneAndUpdate(
      {},
      { storeName: 'IoT Garage', tagline: 'Electronics Components & WhatsApp Ordering' },
      { upsert: false }
    );

    // Import all products
    const { importMassiveData } = require('./seed/importMassiveData');
    const result = await importMassiveData();

    res.status(200).json({
      success: true,
      message: 'Production setup complete',
      admin: adminEmail,
      ...result,
    });
  } catch (error) {
    console.error('Setup production error:', error);
    res.status(500).json({ success: false, message: 'Setup failed', error: error.message });
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
      console.log(`🚀 IoT Garage REST API running on port ${PORT}`);
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
