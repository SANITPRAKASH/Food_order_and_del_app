import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Helper function to create a JWT token with expiration time
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User doesn't exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    const token = createToken(user._id);
    res.json({ success: true, token, message: "Login successful." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred while logging in." });
  }
};

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    // Validate email format & strong password
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email." });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password with at least 8 characters, including upper and lowercase letters, numbers, and special characters.",
      });
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Generate token and log user in automatically
    const token = createToken(user._id);
    res.status(201).json({ success: true, token, message: "Registration successful. Logged in automatically." });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occurred while registering." });
  }
};

export { loginUser, registerUser };
