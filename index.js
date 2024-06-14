const express = require('express');
const app = express();
// Middleware to handle json data
app.use(express.json())

// Load environment variables from .env file
require('dotenv').config({ path: '../.env' });
const port = process.env.PORT || 3000;

// Import routes
const userRoute = require('./routes/userRoute.js');
const medicineRoute = require('./routes/medicineRoute.js');
const cartRoute = require('./routes/cartRoute');

const mongoose = require('mongoose');
// Connect to MongoDB using connection string from environment variables
mongoose.connect(process.env.CLUSTER_STRING).then(() => { console.log("Database connected successfully") })
    .catch((error) => { console.log(error.message) });

// Handle all routes
app.use('/user', userRoute);
app.use('/medicine', medicineRoute);
app.use('/cart',  cartRoute)

app.listen(port, () => {
    console.log(`Server listen on port: ${port}`)
})