const orderModel = require('../models/orderModel.js');
const validation = require('../validator/validation');
const cartModel = require('../models/cartModel');
const razorpayInstance = require('../razorpayConfig.js');

// Place an Order:
const placeOrder = async function (req, res) {
    try {
        const cartId = req.body.cartId;
        if (!validation.checkObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Invalid cartId" });
        }
        const isuserCart = await cartModel.findOne({ _id: cartId })
        if (!isuserCart) {
            return res.status(400).send({ status: false, message: "Cart not found" });
        }
        if (isuserCart.items.length === 0) {
            return res.status(404).send({ status: false, message: "Cart is empty" });
        }

        const proceedOrder = {
            buyerId:isuserCart.buyerId,
            items:isuserCart.items,
            totalItems: isuserCart.items.length,
            totalPrice:isuserCart.totalPrice,
        }
        const createOrder = await orderModel.create(proceedOrder);

        // Convert totalPrice to paise and ensure it's an integer
        const amountInPaise = Math.round(isuserCart.totalPrice * 100); 

        if (amountInPaise < 100) {
            return res.status(400).send({ status: false, message: "Total price should be at least 1 INR" });
        }

        // Create Razorpay order
        const options = {
            amount: amountInPaise, 
            currency: "INR",
            receipt: `receipt_order_${createOrder._id}`,
            payment_capture: 1
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);
        console.log(razorpayOrder.id)

       // Save Razorpay order ID in the database
        await orderModel.findByIdAndUpdate(createOrder._id, {$set:{ razorpayOrderId: razorpayOrder.id }});
        return res.status(200).send(
             {razorpayOrderId: razorpayOrder.id, amount: amountInPaise, buyerId: createOrder.buyerId,})
    
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


// Cancel Order:
const cancelOrder = async function(req,res){
    const buyerId = req.params.buyerId;
    if(!validation.checkObjectId(buyerId)){
        return res.status(400).send({status:false,message: "Invalid buyerId"});
    }

    const {orderId} = req.body;
    if(!validation.checkObjectId(orderId)){
        return res.status(400).send({status:false,message: "Invalid orderId"});
    }

    const checkOrder = await orderModel.findOne({_id:orderId, buyerId:buyerId})
    if(!checkOrder){
        return res.status(404).send({status:false,message: "Order not found"})
    }

    if(buyerId != req.decodedToken.userId){
        return res.status(403).send({status:false,message: "Unauthorized to cancel an order"})
    }

    // Check if the order is already cancelled or completed
    if (checkOrder.orderStatus === 'cancelled') {
        return res.status(400).send({ status: false, message: "Order is already cancelled" });
    }

    if (checkOrder.orderStatus === 'completed') {
        return res.status(400).send({ status: false, message: "Order is completed, You cannot cancel the order" });
    }

    // Check that you can cancelled the order or not
    if(checkOrder.cancellable === true){
        const updateOrder = await orderModel.findByIdAndUpdate({_id:orderId},
            {$set:{orderStatus:'cancelled', cancellable:false}},
            {new:true}
        )

        return res.status(200).send({status:true,message: "Order Cancelled", data:updateOrder});
    }

    return res.status(400).send({status:false,message: "Order cannot be cancelled"})
    
}

module.exports = {placeOrder,cancelOrder};
