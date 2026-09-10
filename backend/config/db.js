const mongoose = require('mongoose');

let memoryServer = null;

const DEFAULT_ATLAS_URI =
  'mongodb://veerapaneniyaswanth5_db_user:yHv1Z8ko3AZqdMo8@ac-sd61e83-shard-00-00.tdwbi4l.mongodb.net:27017,ac-sd61e83-shard-00-01.tdwbi4l.mongodb.net:27017,ac-sd61e83-shard-00-02.tdwbi4l.mongodb.net:27017/test?ssl=true&replicaSet=atlas-jph9rr-shard-0&authSource=admin&appName=Cluster0';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(uri, {
      dbName: 'test',
      serverSelectionTimeoutMS: 15000, // 15 seconds to allow cloud Atlas handshake
    });
    console.log('✅ MongoDB connected successfully to database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
    
    // Only use in-memory server as a last resort in local development
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Attempting fallback to in-memory MongoDB server for local dev...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        console.log(`🚀 In-memory MongoDB server started at: ${memUri}`);
        await mongoose.connect(memUri);
        console.log('✅ Connected to in-memory MongoDB.');
      } catch (memError) {
        console.error('❌ Failed in-memory fallback:', memError.message);
        process.exit(1);
      }
    } else {
      console.error('❌ Production database connection failed. Retrying in 5 seconds...');
      setTimeout(connectDB, 5000);
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
