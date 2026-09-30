const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const medicineSchema = new mongoose.Schema({
    seller: {
        type: objectId,
        ref: "User",
        required: true
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
    price: {
        type: Number,
        required: true
    },
    expiryDate: {
        required: true,
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false,

    }
}, { timestamps: true })

module.exports = mongoose.model("Medicine", medicineSchema)