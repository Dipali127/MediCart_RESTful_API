const orderModel = require("../models/orderModel.js")
const validation = require("../validator/validation")
const cartModel = require("../models/cartModel")
const razorpayInstance = require("../razorpayConfig.js")
const crypto = require("crypto")

//Place an Order:
const placeOrder = async function (req, res) {
  try {
    const cartId = req.body.cartId;

    if (!validation.checkObjectId(cartId)) {
      return res.status(400).send({ status: false, message: "Invalid cartId" });
    }

    const isuserCart = await cartModel.findOne({ _id: cartId });

    if (!isuserCart) {
      return res.status(404).send({ status: false, message: "Cart not found" });
    }

    if (isuserCart.items.length === 0) {
      return res.status(404).send({ status: false, message: "Cart is empty" });
    }

    if (isuserCart.buyerId.toString() !== req.decodedToken.userId) {
      return res.status(403).send({ status: false, message: "Buyer is not authorized to place an order" })
    }

    //Convert totalPrice to paise and ensure it's an integer
    const amountInPaise = Math.round(isuserCart.totalPrice * 100);

    if (amountInPaise < 100) {
      return res.status(400).send({ status: false, message: "Total price should be at least 1 INR" });
    }

    const proceedOrder = {
      buyerId: isuserCart.buyerId,
      items: isuserCart.items,
      totalItems: isuserCart.items.length,
      totalPrice: isuserCart.totalPrice,
    };

    const createOrder = await orderModel.create(proceedOrder);

    //Create a Razorpay order
    const options = {
      amount: amountInPaise,
      currency: "INR"
    };

    let razorpayOrder;

    try {
      razorpayOrder = await razorpayInstance.orders.create(options);
    } catch (error) {
      await orderModel.findByIdAndDelete(createOrder._id);
      throw error;
    }

    //Save Razorpay order ID in the database
    const updatedOrder = await orderModel.findByIdAndUpdate(createOrder._id, {
      $set: { razorpayOrderId: razorpayOrder.id }
    }, { new: true }
    );

    return res.status(201).send({ status: true, message: "Order created successfully", data: updatedOrder });

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//Verify Payment
const verifyPayment = async function (req, res) {
  try {
    const { razorpayOrderId, razorpaySignature, paymentId } = req.body;
    if (!validation.checkData(razorpayOrderId) || !validation.checkData(razorpaySignature) ||
      !validation.checkData(paymentId)) {
      return res.status(400).send({ status: false, message: "Invalid data" });
    }

    const isExistOrder = await orderModel.findOne({ razorpayOrderId: razorpayOrderId });
    if (!isExistOrder) {
      return res.status(400).send({ status: false, message: "Order not found" });
    }

    if (isExistOrder.orderStatus === 'completed') {
      return res.status(400).send({ status: false, message: "Order is already completed" });
    }

    if (isExistOrder.buyerId.toString() !== req.decodedToken.userId) {
      return res.status(403).send({ status: false, message: "Cannot verify payemnt for invalid buyer" })
    }

    //Generate Signature
    const body = razorpayOrderId + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).send({ status: false, message: "Payment verification failed" });
    }

    const isExistCart = await cartModel.findOne({ buyerId: isExistOrder.buyerId });
    if (!isExistCart) {
      return res.status(400).send({ status: false, message: "cart not found" })
    }

    //Clear the buyer's cart after successful payment verification
    await cartModel.findByIdAndUpdate(
      isExistCart._id,
      {
        $set: {
          items: [],
          totalPrice: 0
        }
      }
    )

    const updatedOrder = await orderModel.findByIdAndUpdate(
      isExistOrder._id,
      {
        $set: {
          paymentStatus: "success",
          orderStatus: "completed",
          cancellable: false
        }
      },
      { new: true }
    );

    return res.status(200).send({ status: true, message: "Payment verified successfully", data: updatedOrder });

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

//Cancel Order:
const cancelOrder = async function (req, res) {
  try {
    const buyerId = req.params.buyerId;

    if (!validation.checkObjectId(buyerId)) {
      return res.status(400).send({ status: false, message: "Invalid buyerId" });
    }
    
    const { orderId } = req.body;
    if (!validation.checkObjectId(orderId)) {
      return res.status(400).send({ status: false, message: "Invalid orderId" });
    }
    const checkOrder = await orderModel.findOne({ _id: orderId, buyerId: buyerId})

    if (!checkOrder) {
      return res.status(404).send({ status: false, message: "Order not found" });
    }

    if (buyerId.toString() !== req.decodedToken.userId) {
      return res.status(403).send({ status: false, message: "Unauthorized to cancel an order" });
    }

    if (checkOrder.orderStatus === "cancelled") {
      return res.status(400).send({ status: false, message: "Order is already cancelled" });
    }

    if (checkOrder.orderStatus === "completed") {
      return res.status(400).send({ status: false, message: "Order is completed, You cannot cancel the order" });
    }

    //Check if the order is cancellable
    if (checkOrder.cancellable === true) {
      const updateOrder = await orderModel.findByIdAndUpdate(
        { _id: orderId },
        { $set: { orderStatus: "cancelled", cancellable: false } },
        { new: true }
      );

      return res.status(200).send({ status: true, message: "Order Cancelled", data: updateOrder });
    }

    return res.status(400).send({ status: false, message: "Order cannot be cancelled" });

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = { placeOrder, verifyPayment, cancelOrder };
