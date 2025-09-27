const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);
        
        // Add connection options for better compatibility
        const connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        };
        
        await mongoose.connect(process.env.DB, connectionOptions);
        console.log(`Connected to database successfully ${mongoose.connection.host}`);
    } catch (err) {
        console.error("DB connection error:", err);
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