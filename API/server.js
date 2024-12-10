const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors')
const userRoutes = require('./routes/userRouter');
const bookRoutes = require('./routes/booksRouter');

const app = express();
const port = 3000;

connectDB();

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', bookRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
