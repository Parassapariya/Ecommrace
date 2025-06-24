const express = require ('express');
const router = express.Router ();
const {signup, login} = require ('../controllers/userController');

//signup router
router.post('/signup', signup);

//login
router.post('/login', login);

//export
module.exports = router;
