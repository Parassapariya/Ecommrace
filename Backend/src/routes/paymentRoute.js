//Payment Route
const express = require ('express');
const router = express.Router ();
const verifyToken = require('../middlewares/authMiddleware');
const { createPaymentSession } = require('../controllers/paymentController');

//All product router
router.post('/create-session', verifyToken, createPaymentSession);

//export
module.exports = router;
