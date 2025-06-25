const express = require ('express');
const { product, addproduct, getproduct, deleteproduct, deleteallproduct, updateproduct } = require('../controllers/productController');
const router = express.Router ();
const verifyToken = require('../middlewares/authMiddleware');

//All product router
router.get('/AllProduct', product);

//Add Product Route
router.post('/AddProduct',verifyToken, addproduct);

//Display One Product
router.get('/Product/:id', getproduct);

//Delete One Product
router.delete('/DeleteProduct/:id',verifyToken, deleteproduct);

//Delete All Product
router.delete('/DeleteAllProduct',verifyToken, deleteallproduct);

//Update One Product
router.put('/UpdateProduct/:id',verifyToken, updateproduct);

//export
module.exports = router;
