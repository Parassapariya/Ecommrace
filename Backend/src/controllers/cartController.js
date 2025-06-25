const User = require ('../model/User');
const bcrypt = require ('bcrypt');
const {generateToken} = require ('../services/authService');
const Product = require ('../model/Product');
const jwt = require ('jsonwebtoken');
const Cart = require ('../model/Cart');

//add to cart
const addProductToCart = async (req, res) => {
    try {
      const userId = req.user.userId;
      const productId = req.params.id;
  
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Check if user has a cart
      let cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        // If cart doesn't exist, create a new one
        cart = new Cart({
          user: userId,
          products: [{ productId, quantity: 1 }],
        });
      } else {
        // If cart exists, check if product already in cart
        const existingProduct = cart.products.find(
          (item) => item.productId.toString() === productId
        );
  
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.products.push({ productId, quantity: 1 });
        }
      }
  
      await cart.save();
  
      res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ message: 'Error adding product to cart' });
    }
  };
  

module.exports = {
  addProductToCart,
};
