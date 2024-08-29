const orderModel = require('../models/orderModel.js')
const paymentModel = require('../models/paymentModel')
const cartModel = require('../models/cartModel.js')
const razorpayInstance = require('../razorpayConfig.js')
const crypto = require('crypto')

// Handle payment details sent by the frontend:
const payMent = async function (req, res) {
  try {
    console.log('get payment details from frontend')
    const { razorpayOrderId, paymentId, razorpaySignature } = req.body

    if (!razorpayOrderId || !paymentId || !razorpaySignature) {
      return res.status(400).send({ status: false, message: 'Invalid razorpayOrderId, paymentId, or signature' })
    }

    const isOrderExist = await orderModel.findOne({
      razorpayOrderId: razorpayOrderId 
    })
    if (!isOrderExist) {
      return res.status(404).send({ status: false, message: 'Order not found' })
    }

    // Check if the order is already completed
    // handle duplicate payment scenario
    if (isOrderExist.orderStatus === 'completed') {
      return res.status(400).send({status: false, message: 'Payment already completed' })
    }

    // Verify the Razorpay signature
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest('hex')

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).send({ status: false, message: 'Invalid signature, payment verification failed' })
    }

    const paymentCaptureResponse = await razorpayInstance.payments.fetch(paymentId)

    // Check if payment capture was successful
    if (paymentCaptureResponse.status === 'captured') {
      // Update order status
      await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpayOrderId },
        { $set: { orderStatus: 'completed' } }
      )

      // Delete items from cart
      await cartModel.findOneAndUpdate(
        { buyerId: isOrderExist.buyerId },
        { $set: { items: [], totalPrice: 0 } }
      )

      // Create payment record in your database
      const paymentDetails = {
        razorpayOrderId: razorpayOrderId,
        paymentId: paymentId,
        amountPaid: isOrderExist.totalPrice,
        paymentStatus: 'succeed'
      }
      await paymentModel.create(paymentDetails)

      return res.status(200).send({status: true, message: 'Payment successfully captured', data: paymentDetails })
    } else {
      return res.status(500).send({ status: false, message: 'Payment capture failed' })}
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}

// Handle payment details sent by Razorpay webhook
const handleWebhook = async (req, res) => {
  try {
    console.log('get payment details from webhook')
    const webhookBody = req.body;
    const signature = req.headers['x-razorpay-signature']
   
    // Verify the signature
    const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(JSON.stringify(webhookBody)).digest('hex')

    if (generatedSignature !== signature) {
      return res.status(400).send({ status: false, message: "Invalid Signature" })}

    const { event, payload } = req.body;

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;
      case 'payment.authorized':
        console.log('Handling payment.authorized event');
        break;
      default:
        // Log any unhandled events
        console.log('Unhandled event:', event);
    }

    res.status(200).send({ status: true, message: 'Webhook received' })
  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}

// Payment Capture:
async function handlePaymentCaptured (payload) {
  const order_id = payload.payment.entity.order_id;
  const payment_id = payload.payment.entity.id;

  const order = await orderModel.findOne({ razorpayOrderId: order_id });

  // Handle duplicate payment scenario
  if (order.orderStatus === 'completed') {
    console.log('Payment already completed');
    return;
  }

  // Fetch payment details
  const paymentCaptureResponse = await razorpayInstance.payments.fetch( payment_id)

  if (paymentCaptureResponse.status === 'captured') {
    // Update order status
    await orderModel.findOneAndUpdate(
      { razorpayOrderId: order_id },
      { $set: { orderStatus: 'completed' } }
    )

    // Delete items from cart
    await cartModel.findOneAndUpdate(
      { buyerId: order.buyerId },
      { $set: { items: [], totalPrice: 0 } }
    )

    // Record the payment
    await paymentModel.create({
      razorpayOrderId: order_id,
      paymentId: payment_id,
      amountPaid: paymentCaptureResponse.amount / 100,
      paymentStatus: 'succeed'
    })
  } 
}

// Payment Failed:
async function handlePaymentFailed (payload) {
  const payment_id = payload.payment.entity.id;

  // Update payment status
  await paymentModel.findOneAndUpdate(
    { _id: payment_id },
    { $set: { paymentStatus: 'failed' } }
  )
}

module.exports = { payMent, handleWebhook }
