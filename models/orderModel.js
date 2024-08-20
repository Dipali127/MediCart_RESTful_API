const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const orderSchema = new mongoose.Schema({
    buyerId: {
        type: objectId,
        ref: 'User',
        required: true
    }, 
    items: [{
        medicineId: {
            type: objectId,
            ref: 'Medicine',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }
    ],
    orderStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },//totalItems is nothing but the total number of different medicines in the cart nothing but items.length
    totalItems: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    cancellable: {
        type: Boolean,
        default: true
    },
    razorpayOrderId: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);