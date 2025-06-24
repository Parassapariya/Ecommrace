const express = require ('express');
const router = express.Router ();


//signup router
router.post('/signup', signup);

//login
router.post('/login', login);

//export
module.exports = router;
