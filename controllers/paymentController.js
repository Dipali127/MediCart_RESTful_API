const orderModel = require("../models/orderModel.js");
const paymentModel = require("../models/paymentModel");
const cartModel = require("../models/cartModel.js");
const razorpayInstance = require("../razorpayConfig.js");
const crypto = require("crypto");

const payMent = async function (req, res) {
  try {
    const { razorpayOrderId, paymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !paymentId || !razorpaySignature) {
      return res.status(400).send({status: false, message: "Invalid razorpayOrderId, paymentId, or signature"})
    }

    const isOrderExist = await orderModel.findOne({
      razorpayOrderId: razorpayOrderId,
    });
    if (!isOrderExist) {
      return res.status(404).send({ status: false, message: "Order not found" })
    }

    // Check if the order is already canceled or completed
    if (isOrderExist.orderStatus === "cancelled") {
      return res.status(400).send({status: false, message: "Order is already cancelled, payment cannot be processed" })
    }

    if (isOrderExist.orderStatus === "completed") {
      return res.status(400).send({status: false, message: "Order is already completed, payment cannot be processed again" })
    }

    // Verify the Razorpay signature
    const generatedSignature = crypto .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpayOrderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).send({ status: false, message: "Invalid signature, payment verification failed"});
    }

    const paymentCaptureResponse = await razorpayInstance.payments.fetch(paymentId);

    // Check if payment capture was successful
    if (paymentCaptureResponse.status === "captured") {
      // Update order status
      await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpayOrderId },
        { $set: { orderStatus: "completed" } }
      );

      // Delete items from cart
      await cartModel.findOneAndUpdate(
        { buyerId: isOrderExist.buyerId },
        { $set: { items: [], totalPrice: 0 } }
      );

      // Create payment record in your database
      const paymentDetails = {
        razorpayOrderId: razorpayOrderId,
        paymentId: paymentId,
        amountPaid: isOrderExist.totalPrice,
        paymentStatus: "succeed",
      };
      await paymentModel.create(paymentDetails);

      return res.status(200).send({ status: true,message: "Payment successfully captured",data: paymentDetails});
    } else {
      return res.status(500).send({ status: false, message: "Payment capture failed" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { payMent };
