require('dotenv').config();
const mongoose = require('mongoose');

const clearDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/corex_projects_hub';
  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected.');
    
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      await mongoose.connection.collections[collectionName].deleteMany({});
      console.log(`Cleared collection: ${collectionName}`);
    }
    
    console.log('✅ All data removed successfully.');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

clearDatabase();
