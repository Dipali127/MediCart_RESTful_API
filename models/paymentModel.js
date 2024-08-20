const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    razorpayOrderId:{
        type:String,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    },
    amountPaid:{
        type:Number,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['failed','succeed','pending'],
        default:'pending'
    }
},{timestamps:true})

module.exports = mongoose.model('Payment',paymentSchema);
