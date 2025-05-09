const connectDB = require('./config/database');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await connectDB();
        
        // If we reach here, connection was successful
        console.log('✅ Connection test successful!');
        console.log('MongoDB is connected and ready to use.');
        
        // Keep the connection open for a few seconds to see the logs
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Close the connection
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection test failed!');
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

testConnection(); 