import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import rightColumn from "../images/right-column.png";
import logo from "../images/logo.png";

const Signup2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromState = location.state?.email || "";
  const nameFromState = location.state?.name || "";
  const dateOfBirthFromState = location.state?.dateOfBirth || "";

  const [formData] = useState({
    name: nameFromState,
    dateOfBirth: dateOfBirthFromState,
    email: emailFromState,
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/signup2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          email: formData.email,
          otp,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("OTP verified successfully!");
        localStorage.setItem("token", result.token);
        navigate(`/dashboard/`);
      } else {
        alert(result.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendStatus("");

    try {
      const response = await fetch("http://localhost:4000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setResendStatus("OTP resent successfully!");
        alert("OTP has been resent to your email.");
      } else {
        setResendStatus(result.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setResendStatus("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex justify-center md:justify-start mb-10">
            <img src={logo} alt="Logo" className="w-16" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
          <p className="text-gray-500">Sign up to enjoy the feature of HD</p>

          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            readOnly
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full p-3 border rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
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

          {/* Submit Button with loading spinner */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
                  />
                </svg>
                Verifying...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Resend OTP */}
          <p className="text-sm text-center">
            Didn't receive OTP?{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={handleResendOtp}
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          </p>

          {resendStatus && (
            <p className="text-xs text-center text-gray-500">{resendStatus}</p>
          )}
        </form>
      </div>

      {/* Right Column (Image) */}
      <div className="hidden md:block w-1/2 h-screen">
        <img
          src={rightColumn}
          alt="Signup Visual"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default Signup2;
