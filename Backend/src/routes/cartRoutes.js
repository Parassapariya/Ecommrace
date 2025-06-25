const express = require ('express');
const { addProductToCart } = require('../controllers/cartController');
const router = express.Router ();
const verifyToken = require('../middlewares/authMiddleware');

//cart route
router.post('/:id', verifyToken, addProductToCart);

//export
module.exports = router;
