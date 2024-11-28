const express = require('express');
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRouter');

const app = express();
const port = 3000;

// Connect to Database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
