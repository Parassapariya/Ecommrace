const User = require('../model/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../services/authService');
const Product = require('../model/Product');
const jwt = require('jsonwebtoken');
const Cart = require('../model/Cart');


//add to cart
const addProductToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findById(productId);
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has a cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If cart doesn't exist, create a new cart with quantity and price of the product 
      cart = new Cart({
        user: userId,
        products: [
          {
            productId: productId,  // use productId here!
            quantity: 1,
            price: product.price
          }
        ],
      });
    } else {
      // If cart exists, check if product already in cart so update quantity with price
      const existingProduct = cart.products.find(
        (item) => item.productId && item.productId.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.price = product.price;
      } else {
        cart.products.push({ productId: productId, quantity: 1, price: product.price });
      }
    }

    // Calculate total price
    cart.total = cart.products.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    await cart.save();

    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Error adding product to cart' });
  }
};

//update cart with both increace and decrece with the action and productid pass in body
const updatecart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { action, productId } = req.body;
    // console.log(req.body);
    // console.log(userId);
    
    

    // Check if user has a cart
    let cart = await Cart.findOne({ user: userId });
    console.log(cart);
    
    if (!cart) {
      // If cart doesn't exist, create a new cart with quantity and price of the product
      cart = new Cart({
        user: userId,
        products: [
          {
            productId: productId,
            quantity: 1,
            price: product.price
          }
        ]
      }
      );
    } else {
      // If cart exists, check if product already in cart so update quantity with price
      const existingProduct = cart.products.find(
        (item) => item.productId && item.productId.toString() === productId 
      );
      console.log(existingProduct);
      
      if (existingProduct) {
        if (action === 'increase') {
          existingProduct.quantity++;
        } else if (action === 'decrease') {
          existingProduct.quantity--;
          if (existingProduct.quantity <=
            0) {
            cart.products.splice(cart.products.indexOf(existingProduct), 1);
          }
        }
      }
    }
    // Save cart to database
    await cart.save();
    res.status(200).json({ message: 'Cart created successfully', cart });
    return;
  }
  catch (error) {
    res.status(500).json({ message: 'Error creating cart' });
  }

}

module.exports = {
  addProductToCart,
  updatecart
};
