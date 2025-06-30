const Cart = require('../model/Cart');
const Product = require('../model/Product');
const Payment = require('../model/Payment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendEmail = require('../utils/userEmail');  // Your email utility

const createPaymentSession = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Get user email (assuming you have User model or user info attached in req.user)
    // If you don't have it, fetch from DB here
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ message: 'User email not found' });
    }

    // Get products info to check stock and price
    const productIds = cart.products.map(p => p.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Prepare Stripe line items
    const lineItems = cart.products.map(cartItem => {
      const product = products.find(p => p._id.toString() === cartItem.productId.toString());

      if (!product) throw new Error(`Product ${cartItem.productId} not found`);
      if (cartItem.quantity > product.stock) throw new Error(`Insufficient stock for ${product.name}`);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || '',
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: cartItem.quantity,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
      metadata: { userId },
    });

    // Record payment with status 'pending'
    await Payment.create({
      userId,
      products: cart.products,
      total: cart.total,
      stripeSessionId: session.id,
      paymentStatus: 'pending',
    });

    // Prepare product details for email
    const productDetailsForEmail = cart.products.map(cartItem => {
      const product = products.find(p => p._id.toString() === cartItem.productId.toString());
      return {
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
      };
    });

    // Send confirmation email
    await sendEmail(userEmail, productDetailsForEmail);

    // Empty the cart
    cart.products = [];
    cart.total = 0;
    await cart.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error('Payment session creation error:', error.message);
    res.status(400).json({ message: error.message || 'Failed to create payment session' });
  }
};

module.exports = {
  createPaymentSession,
};
