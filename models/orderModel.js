const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const orderSchema = new mongoose.Schema({
    cartId: {
        type: objectId,
        ref:'cart',
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },//totalItems is nothing but the total number of different medicines in the cart nothing but items.length
    totalItems: {
        type: Number,
        required:true
    },
    cancellable:{
        type:Boolean,
        default:true
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);