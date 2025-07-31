import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import rightColumn from "../images/right-column.png";
import logo from "../images/logo.png";

const Signup1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("OTP sent to your email!");
        console.log("OTP sent:", result.otp); // For dev only
        navigate("/signup2", {
          state: {
            email: formData.email,
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
          },
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex justify-center md:justify-start mb-48">
            <img src={logo} alt="Logo" className="w-16" />
          </div>

          <h2 className="text-3xl text-left font-bold text-gray-900">Sign up</h2>
          <p className="text-gray-500 text-left">
            Sign up to enjoy the feature of HD
          </p>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded-xl"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 flex items-center justify-center"
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
                Sending OTP...
              </>
            ) : (
              "Get OTP"
            )}
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>

      {/* Right Side - Image */}
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

export default Signup1;
