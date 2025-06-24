const express = require ('express');
const router = express.Router ();
const userRoute = require ('./userRoutes');
const productRoute = require ('./productRoutes');

router.use('/api/users', userRoute);
router.use('/api/product', productRoute);

module.exports = router;