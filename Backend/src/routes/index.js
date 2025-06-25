const express = require ('express');
const router = express.Router ();
const userRoute = require ('./userRoutes');
const productRoute = require ('./productRoutes');
const cartRoute = require ('./cartRoutes');

router.use('/api/users', userRoute);
router.use('/api/product', productRoute);
router.use('/api/cart', cartRoute);

module.exports = router;