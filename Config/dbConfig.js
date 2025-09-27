const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);
        
        // Updated connection options for MongoDB Driver 6.x+
        const connectionOptions = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4, skip trying IPv6
        };
        
        // Add retry logic for production
        let retries = 5;
        while (retries) {
            try {
                await mongoose.connect(process.env.DB, connectionOptions);
                console.log(`Connected to database successfully ${mongoose.connection.host}`);
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
        console.error("DB connection failed after retries:", err);
        // Exit process with failure if database connection fails
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');});

module.exports = { connectDb };