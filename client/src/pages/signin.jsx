import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import rightColumn from "../images/right-column.png";
import logo from "../images/logo.png";


const signin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resendStatus, setResendStatus] = useState("");
  const [loading, setLoading] = useState(false);


  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("OTP verified successfully!");
        localStorage.setItem("token", result.token);
        navigate(`/dashboard/`); // Navigate to welcome or dashboard page
      } else {
        alert(result.message || "Invalid OTP");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

   const handleResendOtp = async (e) => {
     e.preventDefault(); // Important to prevent form submit on button click
      setLoading(true);
      setResendStatus("");
      if (!email.trim()) {
        setResendStatus("Please enter an email first.");

        return;
      }
    try {
      const response = await fetch("http://localhost:4000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setResendStatus('OTP resent successfully!');
        alert("OTP has been resent to your email.");
        console.log("OTP resent:", result.otp); // For dev only
      } else {
        setResendStatus(result.message || "Failed to resend OTP");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error resending OTP:", error);
      setResendStatus("Something went wrong. Please try again.");
    }
  }


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {/* logo */}
          <div className="flex justify-center md:justify-start mb-48">
            <img src={logo} alt="Logo" className="w-16" />
          </div>

          <h2 className="text-3xl font-bold text-left text-gray-900">Sign in</h2>
          <p className="text-gray-500 text-left">Please login to continue to your account</p>

          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-xl  text-gray-700"
          />

          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 border rounded-xl"
            required
          />
           <p className="text-sm text-start">
            {/* if loading then show loading text */}
            {loading ? (
              <span>Sending...</span>
            ) : (
              <button  type="button" className="text-blue-500 hover:underline  cursor-pointer " onClick={handleResendOtp}>
               Resend OTP
            </button>)}
          </p>

           {/* keep me logged in */}
            <div className="flex items-center justify-between">
                <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Keep me logged in
                </label>
         </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600"
          >
            Signin
          </button>

             {/* need an account? create one */}
        <p className="text-sm text-center mt-4">
          Need an account?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => navigate("/signup1")}
          >
            Create one
          </span>
        </p>
        </form>
       
      </div>

      <div className="hidden md:block w-1/2 h-screen">
        <img
          src={rightColumn}
          alt="Signup Visual"
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default signin;
