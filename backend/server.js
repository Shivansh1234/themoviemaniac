const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');

// const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
// const manageTodoRoutes = require('./routes/manageTodoRoutes');

// connect to db
connectDB();

const app = express();

// cors middleware
app.use(cors());

// bodyParser middleware
app.use(bodyParser.json());

// app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/manageTodo', manageTodoRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));