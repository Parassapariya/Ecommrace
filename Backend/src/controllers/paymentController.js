const Cart = require('../model/Cart');
const Product = require('../model/Product');
const Payment = require('../model/Payment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentSession = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Fetch all products details to validate price and stock
    const productIds = cart.products.map(p => p.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Build Stripe line items array
    const lineItems = [];

    for (const cartItem of cart.products) {
      const product = products.find(p => p._id.toString() === cartItem.productId.toString());
      if (!product) {
        return res.status(400).json({ message: `Product ${cartItem.productId} not found` });
      }

      if (cartItem.quantity > product.stock) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      lineItems.push({
        price_data: {
          currency: 'usd',  // change if needed
          product_data: {
            name: product.name,
            description: product.description || '',
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: cartItem.quantity,
      });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
      metadata: { userId }
    });

    // Optional: Create payment record with status 'pending' here to track session
    await Payment.create({
      userId,
      products: cart.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        price: p.price,
      })),
      total: cart.total,
      stripeSessionId: session.id,
      paymentStatus: 'pending',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Payment session creation error:', error);
    res.status(500).json({ message: 'Failed to create payment session' });
  }
};

module.exports = {
  createPaymentSession,
};
