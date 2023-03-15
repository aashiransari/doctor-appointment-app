const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const moragan = require('morgan');
const ConnectDB = require('./config/db');
const path = require('path');

// DOTENV
dotenv.config();

// MONGODB CONNECTION
ConnectDB();

// REST OBJECT
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(moragan('dev'));

// ROUTES
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/doctor', require('./routes/doctorRoutes'));

// STATIC FILES
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, './client/build/index.html'));
 })

// PORT
const port = process.env.PORT || 8080

// LISTEN PORT
app.listen(port, (req, res) => {
    console.log(`Server running in ${process.env.NODE_MODE} Mode on Port ${port}`.bgGreen.white);
})
