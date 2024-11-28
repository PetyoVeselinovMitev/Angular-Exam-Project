const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/library');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

module.exports = connectDB;