//Payment Route
const express = require ('express');
const router = express.Router ();
const verifyToken = require('../middlewares/authMiddleware');
const { PaymentGetway } = require('../controllers/paymentController');

//All product router
router.get('/Payment', PaymentGetway);


//export
module.exports = router;
