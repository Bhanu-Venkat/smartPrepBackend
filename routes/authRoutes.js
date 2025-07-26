const express = require('express');
const { signin, signup, forgotPassword, resetPassword, verifyParentOtp } = require('../controllers/authController');

const router = express.Router();


router.post('/signin', signin);
router.post('/signup', signup);
router.post('/forgot/password', forgotPassword);
router.post('/reset', resetPassword);
router.post('/verify-otp', verifyParentOtp);


module.exports = router;
