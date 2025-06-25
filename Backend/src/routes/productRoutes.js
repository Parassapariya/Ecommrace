const express = require ('express');
const { product, addproduct, getproduct, deleteproduct, deleteallproduct, updateproduct } = require('../controllers/productController');
const router = express.Router ();

//All product router
router.get('/AllProduct', product);

//Add Product Route
router.post('/AddProduct', addproduct);

//Display One Product
router.get('/Product/:id', getproduct);

//Delete One Product
router.delete('/DeleteProduct/:id', deleteproduct);

//Delete All Product
router.delete('/DeleteAllProduct', deleteallproduct);

//Update One Product
router.put('/UpdateProduct/:id', updateproduct);

//export
module.exports = router;
