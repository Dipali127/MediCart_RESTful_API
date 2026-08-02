//Load environment variables from .env file
require('dotenv').config({ path: '../.env' });
const port = process.env.PORT || 3000;

const express = require('express');
const app = express();
//Middleware to handle json data
app.use(express.json())

//Import routes
const userRoute = require('./routes/userRoute.js');
const medicineRoute = require('./routes/medicineRoute.js');
const cartRoute = require('./routes/cartRoute.js');
const orderRoute = require('./routes/orderRoute.js')

//Connect to MongoDB using connection string from environment variables
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(() => { console.log("Database connected successfully") })
    .catch((error) => { console.log(error.message) });

//Handle all routes
app.use('/user', userRoute);
app.use('/medicine', medicineRoute);
app.use('/cart',  cartRoute);
app.use('/order', orderRoute);

app.listen(port, () => { console.log(`Server is listening on port ${port}`)})