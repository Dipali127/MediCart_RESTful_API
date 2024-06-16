const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const orderSchema = new mongoose.Schema({
    buyerId:{
        type:objectId,
        ref:'User',
        required:true
    },
    cartId:{
        type:objectId,
        ref:'Cart',
        required:true
    },
    orderStatus:{
        type:String,
        enum:['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
        default:'pending'
    },
    
})

module.exports = mongoose.model('Order', orderSchema);