const models = require('../models');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_jwt_secret_key";



function authController () {};

// Register
authController.register = async (req, res) => {
    const { cust_id, first_name, last_name, username, password, phone, email, signup_date } = req.body;
    const data = { cust_id, first_name, last_name, username, password, phone, email, signup_date };

    const user = await models.auth.getUser();
    const userArray = user.rows;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    data.password = hashedPassword;

      try {
        // Check if user already exists
        const existingUser =  userArray.find(u => u.email === email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }
        models.auth.newUser(data, err => {
          if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
          res.status(200).json({ message: 'Registration successful' });
        })

      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
      }
};


//Login
authController.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await models.auth.getUser();
  const userArray = user.rows;

  try {
    // Find the user by email
    const loginUser = await userArray.find(u => u.username === username);
    if (!loginUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, loginUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Send JWT token and user info
    const token = jwt.sign({cust_id: loginUser.cust_id}, JWT_SECRET_KEY, {expiresIn: JWT_EXPIRES_IN});
    res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
    res.json({ message: "Login successfully", token: token});
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = authController;