const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const medicineSchema = new mongoose.Schema({
    seller: {
        type: objectId,
        ref: "User"
    },
    category: {
        type: String,
        required: true
    },
    medicineName: {
        type: String,
        required: true
    },
    medicineImage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    form: {
        type: String,
        required: true,
        enum: ["tablet", "capsule", "syrup"]
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currencyId: {
        type: String,
        required: true
    },
    currencyFormat: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,

    },deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("Medicine",medicineSchema)