const express = require('express');
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRouter');
const bookRoutes = require('./routes/booksRouter');

const app = express();
const port = 3000;

connectDB();

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', bookRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
