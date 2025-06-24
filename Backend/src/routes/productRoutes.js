const express = require ('express');
const { product, addproduct, getproduct } = require('../controllers/productController');
const router = express.Router ();

//All product router
router.get('/AllProduct', product);

//Add Product Route
router.post('/AddProduct', addproduct);

//Display One Product
router.get('/Product/:id', getproduct);

//export
module.exports = router;
