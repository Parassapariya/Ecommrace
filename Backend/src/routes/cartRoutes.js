const express = require ('express');
const { addProductToCart, updatecart } = require('../controllers/cartController');
const router = express.Router ();
const verifyToken = require('../middlewares/authMiddleware');

//cart route
router.post('/:id', verifyToken, addProductToCart);
//updatre cart
router.put('/update', verifyToken, updatecart);

//export
module.exports = router;
