const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // price per unit at purchase time
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  stripeSessionId: {
    type: String, // To store Stripe checkout session id for reference
    required: true,
    unique: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentIntentId: {
    type: String, // Stripe PaymentIntent ID (optional, for tracking)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paidAt: {
    type: Date, // When the payment was completed
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
