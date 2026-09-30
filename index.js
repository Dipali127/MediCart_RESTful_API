//Load an environment variables from .env file
require('dotenv').config({ path: '../.env' });
const port = process.env.PORT || 3000;

const path = require('path');

const express = require('express');
const app = express();
//Middleware to handle json data
app.use(express.json())

//Import routes
const userRoute = require('./routes/userRoute.js');
const medicineRoute = require('./routes/medicineRoute.js');
const cartRoute = require('./routes/cartRoute.js');
const orderRoute = require('./routes/orderRoute.js')

//Connect to MongoDB database with nodejs application using the connection string stored in the .env file.
//mongoose.connect() returns a Promise.
//.then() executes when the connection is successfully established and logs a success message to the console.
//.catch() executes when the connection fails and logs the error message to the console.
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(() => { console.log("Database connected successfully") })
    .catch((error) => { console.log(error.message) });

//Serve static files (HTML, CSS, JS, images) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

//Handle all routes
app.use('/user', userRoute);
app.use('/medicine', medicineRoute);
app.use('/cart',  cartRoute);
app.use('/order', orderRoute);

app.listen(port, () => { console.log(`Server is listening on port ${port}`)})