const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');

async function emergencyFix() {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    const db = mongoose.connection.db;
    const collection = db.collection('doctors');

    // 1. First, let's see all indexes
    console.log('Checking existing indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(index => index.name));

    // 2. Try to drop the problematic index
    try {
      await collection.dropIndex('email_1');
      console.log('✅ Successfully dropped email_1 index');
    } catch (dropError) {
      console.log('ℹ️ Could not drop email_1 index (might not exist):', dropError.message);
    }

    // 3. Remove all documents with null email (temporary fix)
    console.log('Cleaning up documents with null email...');
    const deleteResult = await collection.deleteMany({ email: null });
    console.log(`✅ Removed ${deleteResult.deletedCount} documents with null email`);

    // 4. Create a proper sparse unique index
    console.log('Creating new sparse unique index...');
    await collection.createIndex(
      { email: 1 },
      { 
        unique: true, 
        sparse: true,
        name: 'email_unique_sparse'
      }
    );
    console.log('✅ Created sparse unique index on email');

    // 5. Verify the new index
    const newIndexes = await collection.indexes();
    console.log('Final indexes:', newIndexes.map(index => index.name));

    console.log('\n🎉 Emergency fix completed successfully!');
    console.log('✅ Removed null email documents');
    console.log('✅ Created proper sparse unique index');
    console.log('✅ You can now register doctors without errors');

    process.exit(0);

  } catch (error) {
    console.error('❌ Emergency fix failed:', error);
    process.exit(1);
  }
}

emergencyFix();