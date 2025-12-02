import React, { useState } from "react";
import axios from "axios";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 to-orange-100 px-4">
      <form
        onSubmit={sendOtp}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center text-[#c85a32] mb-6">
          Change Your Password
        </h1>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="font-semibold text-gray-700 block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#dfa26d] outline-none transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit" 
          disabled={loading}
          className="w-full bg-[#dfa26d] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#e6b07c] transition-all duration-300 disabled:opacity-60"
        >
          {loading ? <span className="animate-pulse">Submitting...</span> : "Submit"}
        </button>

        {/* Message */}
        {message && (
          <p className="text-center text-red-600 font-semibold mt-3">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default ForgetPassword;