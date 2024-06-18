const orderModel = require('../models/orderModel.js');
const validation = require('../validator/validation');
const cartModel = require('../models/cartModel');

// Place an Order:
const placeOrder = async function (req, res) {
    try {
        const buyerId = req.params.buyerId;
        if (!validation.checkObjectId(buyerId)) {
            return res.status(400).send({ status: false, message: " Invalid buyerId " });
        }

        // Check authorization
        if(buyerId!=req.decodedToken.userId){
            return res.status(403).send({status:false,message:" Unauthorized to place an order "})
        }

        const cartId = req.body.cartId;
        if (!validation.checkObjectId(cartId)) {
            return res.status(400).send({ status: false, message: " Invalid cartId " });
        }

        // Check and fetch provided buyerId cart's details
        const isuserCart = await cartModel.findOne({ buyerId: buyerId, _id: cartId })
        if (!isuserCart) {
            return res.status(400).send({ status: false, message: " Cart not found " });
        }

        // Check provided buyerId cart is empty
        if (isuserCart.items.length === 0) {
            return res.status(404).send({ status: false, message: " Cart is empty " });
        }

        if (req.body.orderStatus && !['pending', 'completed', 'cancelled'].includes(req.body.orderStatus)) {
            return res.status(400).send({ status: false, message: "orderStatus should be :-  ['pending', 'completed', 'cancelled'] " })
        }

        const totalItems = isuserCart.items.length;
        const proceedOrder = {

            cartId:isuserCart,
            totalItems: totalItems,
            orderStatus: req.body.orderStatus||'pending',
            cancellable: req.body.cancellable|| true
        }

        const createOrder = await orderModel.create(proceedOrder);
        // Remove items from the cart after placing the order
        await cartModel.findOneAndUpdate({buyerId:buyerId, _id:cartId}, {$set:{items:[],totalPrice:0}})
        return res.status(201).send({ status: true, message: " Order Successfully Created ", data: createOrder });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// Cancel Order:
const cancelOrder = async function(req,res){
    const buyerId = req.params.buyerId;
    if(!validation.checkObjectId(buyerId)){
        return res.status(400).send({status:false,message:" Invalid buyerId "});
    }

    // Check authorization
    if(buyerId!=req.decodedToken.userId){
        return res.status(403).send({status:false,message:" Unauthorized to cancel an order "})
    }

    const {orderId} = req.body;
    if(!validation.checkObjectId(orderId)){
        return res.status(400).send({status:false,message:" Invalid orderId "});
    }

    const checkOrder = await orderModel.findOne({_id:orderId})
    if(!checkOrder){
        return res.status(404).send({status:false,message:" Order not found "})
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

        return res.status(200).send({status:true,message:" Order Cancelled ", data:updateOrder});
    }

    return res.status(400).send({status:false,message:" Order cannot be cancelled "})
    
}

module.exports = {placeOrder,cancelOrder};
