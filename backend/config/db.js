const mongoose = require('mongoose');

let memoryServer = null;

const DEFAULT_ATLAS_URI =
  'mongodb://veerapaneniyaswanth5_db_user:yHv1Z8ko3AZqdMo8@ac-sd61e83-shard-00-00.tdwbi4l.mongodb.net:27017,ac-sd61e83-shard-00-01.tdwbi4l.mongodb.net:27017,ac-sd61e83-shard-00-02.tdwbi4l.mongodb.net:27017/?ssl=true&replicaSet=atlas-jph9rr-shard-0&authSource=admin&appName=Cluster0';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;

  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ MongoDB connected successfully to database');
  } catch (error) {
    console.warn('⚠️  Could not connect to external/local MongoDB instance:', error.message);
    console.log('🔄 Attempting fallback to in-memory MongoDB server for zero-friction local development...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      console.log(`🚀 In-memory MongoDB server started at: ${memUri}`);
      
      await mongoose.connect(memUri);
      console.log('✅ Connected to in-memory MongoDB. (Data stored in memory for this session)');
    } catch (memError) {
      console.error('❌ Failed to initialize fallback in-memory MongoDB:', memError.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
