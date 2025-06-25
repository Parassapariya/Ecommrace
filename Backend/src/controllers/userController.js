const User = require ('../model/User');
const bcrypt = require ('bcrypt');
const {generateToken} = require ('../services/authService');

const signup = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
      return res.status (400).json ({message: 'Please fill in all fields.'});
    }

    // Check if user exists
    const existingUser = await User.findOne ({email});
    if (existingUser) {
      return res.status (400).json ({message: 'Email already exists.'});
    }

    // Hash password
    const salt = await bcrypt.genSalt (10);
    const hashedPassword = await bcrypt.hash (password, salt);

    // Create new user with token
    const user = new User ({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token after saving user
    const token = generateToken (user);

    console.log("Generated Token:", token);

    user.token = token;
    
    // Save user to DB
    await user.save ();

    // Respond with user info + token
    res.status (201).json ({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error (error);
    res.status (500).json ({message: 'Invalid request'});
  }
};

//login controllr
const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne ({email});
    if (!user) {
      return res.status (401).json ({message: 'Invalid email or password'});
    }
    const isValidPassword = await bcrypt.compare (password, user.password);
    if (!isValidPassword) {
      return res.status (401).json ({message: 'Invalid email or password'});
    }
    const token = generateToken (user);
    res.status (200).json ({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error (error);
    res.status (500).json ({message: 'Invalid request'});
  }
};

module.exports = {
  signup,
  login,
};
