const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookies, body, or headers
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded token:", decoded);

      // Attach user data to request
      req.user = decoded.userId;
       console.log("User ID from token:", req.user); // Debugging line
      next(); // Continue to next middleware or controller
    } catch (err) {
      // Optional: clear cookie if token is expired
      res.clearCookie("token");

      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
        error: err.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
      error: err.message,
    });
  }
};
