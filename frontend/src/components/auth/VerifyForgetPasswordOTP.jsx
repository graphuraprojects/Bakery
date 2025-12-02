import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyForgetPasswordOTP = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("fpEmail");

    if (!storedEmail) {
      setMessage("❌ No email found. Please restart password reset process.");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
          purpose: "forgot-password",
        }
      );

      if (res.data.purpose === "forgot-password") {
        navigate("/reset-password");
      }
    } catch (err) {
      setMessage("❌ OTP verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-yellow-100 via-orange-100 to-white">
      <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Verify OTP
        </h1>

        <p className="text-center text-gray-600 mb-4">
          OTP sent to: <span className="font-semibold text-gray-900">{email}</span>
        </p>

        <form onSubmit={handleVerifyOtp} className="space-y-4">

          {/* OTP Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Enter OTP
            </label>
            <input
              type="number"
              placeholder="Enter the 4-digit OTP"
              required
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold
            shadow-md hover:bg-orange-600 transition-all"
          >
            Verify OTP
          </button>

          {/* Message */}
          {message && (
            <p className="text-center font-medium text-gray-700 mt-3">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyForgetPasswordOTP;
