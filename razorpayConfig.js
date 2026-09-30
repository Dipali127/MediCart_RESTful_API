const Razorpay = require('razorpay')
//Creates a Razorpay instance using the Razorpay-provided Key ID and Key Secret
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET 
});

module.exports = razorpayInstance