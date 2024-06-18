const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;

const paymentSchema = new mongoose.Schema({
    orderId:{
        type:objectId,
        ref:'Order',
        required:true
    },
    paymentMethod:{
        type:String,
        enum:['credit_card', 'debit_card', 'paypal', 'bank_transfer']
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
