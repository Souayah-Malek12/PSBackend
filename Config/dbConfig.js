const mongoose = require("mongoose");

const connectDb = async () => {
    if (!process.env.DB) {
        console.error('MongoDB connection string is not defined in environment variables');
        process.exit(1);
    }

    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);
        
        // Updated connection options for MongoDB Driver 6.x+
        const connectionOptions = {
            serverSelectionTimeoutMS: 10000, // Increased timeout
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
            maxPoolSize: 10, // Maximum number of connections in the connection pool
            retryWrites: true,
            w: 'majority'
        };
        
        console.log('Attempting to connect to MongoDB...');
        
        // Add retry logic for production
        let retries = 5;
        let lastError;
        
        while (retries > 0) {
            try {
                await mongoose.connect(process.env.DB, connectionOptions);
                console.log(`✅ Connected to MongoDB at ${mongoose.connection.host}`);
                return; // Successfully connected, exit the function
                return;
            } catch (err) {
                console.error(`Connection attempt ${6 - retries} failed:`, err.message);
                retries--;
                if (retries === 0) throw err;
                // Wait for 5 seconds before retrying
                await new Promise(res => setTimeout(res, 5000));
            }
        }
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB after multiple attempts:', err.message);
        console.error('Connection string:', process.env.DB ? '***' + process.env.DB.substring(Math.max(0, process.env.DB.length - 20)) : 'Not set');
        console.error('Please check your MongoDB connection string and ensure the database is accessible');
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('error', err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Error stack:', err.stack);
});

mongoose.connection.on('disconnected', () => {
    console.log('ℹ️  MongoDB disconnected');    
    // Attempt to reconnect
    console.log('Attempting to reconnect to MongoDB...');
    connectDb().catch(err => {
        console.error('Failed to reconnect to MongoDB:', err.message);
    });
});

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

module.exports = { connectDb };