const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors')
const userRoutes = require('./routes/userRouter');
const bookRoutes = require('./routes/booksRouter');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

connectDB();

const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser())
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', bookRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
