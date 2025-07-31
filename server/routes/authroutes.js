const express = require("express");
const router = express.Router();
const { signup1,signin,signup2,resendOTP,dashboard } = require("../controller/Auth");
const { auth } = require("../middleware/Auth");


router.post("/signup1", signup1);
router.post("/signup2", signup2);
router.post("/signin", signin);
router.post("/resend-otp", resendOTP)
router.get("/dashboard",auth, dashboard )

module.exports = router;
