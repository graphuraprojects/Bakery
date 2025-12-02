import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("fpEmail");

    if (!storedEmail) {
      setMessage("❌ No email found. Please restart password reset process.");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMessage("❌ Passwords do not match");
    }

    try {
      await axios.put("http://localhost:5000/api/auth/reset-password", {
        email,
        newPassword: password,
        confirmPassword,
      });

      // Cleanup
      localStorage.removeItem("fpEmail");

      setMessage("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        {/* Email Display */}
        <p className="text-center text-gray-600 mb-4">
          Reset password for:{" "}
          <span className="font-semibold text-gray-900">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg 
            shadow-md hover:bg-orange-600 transition-all"
          >
            Reset Password
          </button>

          {/* Message */}
          {message && (
            <p className="text-center font-medium mt-4 text-gray-700">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
