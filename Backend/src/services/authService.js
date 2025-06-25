const jwt = require('jsonwebtoken');

const generateToken = user => {
  return jwt.sign(
    { email: user.email, userId: user._id }, // ✅ Include userId
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = { generateToken };
