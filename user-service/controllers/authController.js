const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Hash password using crypto
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { 
    name, username, email, password, role,  coursesEnrolled, completedCourses,  contactNumber, address, preferences
  } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  try {
    // Hash the password
    const hashedPassword = hashPassword(password);

    // Create a new user instance with the updated fields
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: role || 'Student',
      coursesEnrolled,
      completedCourses,
      contactNumber,
      address,
      preferences,
    });

    // Save the new user to the database
    await user.save();

    // Return success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle errors (e.g., validation errors, database issues)

    // Handle validation errors
    if (error.name === 'ValidationError') {
      // Validation errors are specific to Mongoose validation
      const errorMessages = [];
      for (let field in error.errors) {
        errorMessages.push(error.errors[field].message); // Collecting all validation error messages
      }
      return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
    }

    console.error(error);
    res.status(500).json({ message: `Error registering user: ${error.message}` });
  }
};

// Login the user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the password using crypto
    const hashedPassword = hashPassword(password);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET, // Replace with a strong secret key
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: `${user.role} Login successful`,
      token
    });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};