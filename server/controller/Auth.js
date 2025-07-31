const User= require('../model/User');
const OTP = require('../model/OTP');    
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/mailSender.js');
const Note = require('../model/Note.js'); // Adjust path as needed
require('dotenv').config();

//Signup1 controller


exports.signup1 = async (req, res) => {
  try {
    const { name, dateOfBirth, email } = req.body;

    if (!name || !dateOfBirth || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate a 6-digit numeric OTP
    let otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure OTP uniqueness
    let otpExists = await OTP.findOne({ otp });
    while (otpExists) {
      otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      otpExists = await OTP.findOne({ otp });
    }

    await OTP.create({
      email,
      otp,
      createdAt: new Date(),
    });
  console.log("OTP generated:");
    // Optional: Send via mailSender
    await mailSender(email, "OTP for Signup", `Your OTP is ${otp}`);

    res.status(200).json({
      message: "OTP generated and sent successfully",
      otp, // return only during testing
    });
  } catch (error) {
    console.error("Signup Phase 1 Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//signup2 controller
exports.signup2 = async (req, res) => {
  try {
    const { name, dateOfBirth, email, otp } = req.body;

    if (!name || !dateOfBirth || !email || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const latestOTP = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    if (!latestOTP || latestOTP.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Debug print
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    // Create new user first
     const newUser=   await User.create({ name, dateOfBirth, email });

    // then JWT Token generation
    const token = jwt.sign(
      { email,
        userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );



    res.status(201).json({
      message: "User signed up successfully",
      token,
    });
  } catch (error) {
    console.error("Signup Phase 2 Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};









//signin controller


exports.signin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const latestOTP = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);

    if (!latestOTP || latestOTP.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send token in cookie + response
    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        user,
      });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//resned otp controller
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

   

    // Generate and save new OTP
    let otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let otpExists = await OTP.findOne({ otp });
    while (otpExists) {
      otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      otpExists = await OTP.findOne({ otp });
    }

    await OTP.create({ email, otp });

    // Optionally use mailSender here
    await mailSender(email, "OTP Resent", `Your OTP is ${otp}`);

    res.status(200).json({
      message: "OTP resent successfully",
      otp,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



//create a dashboard controller and get user details from database
exports.dashboard= async (req, res) => {
  //get user deatils and notes from database
  try {
    const userId = req.user;
    console.log("userid:", userId); // Assuming userId is set in middleware
    const user = await User.findById(userId);
    const notes = await Note.find({ user: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!notes) {
      return res.status(404).json({ message: "No notes found for this user" });
    }

    res.status(200).json({
      message: "Dashboard fetched successfully",
      user: {
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
      },
      notes,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
  