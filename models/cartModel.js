const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const cartSchema = new mongoose.Schema({
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
    totalPrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

module.exports = mongoose.model('Cart', cartSchema);