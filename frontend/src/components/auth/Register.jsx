import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target; 
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/register`,
        formData
      );
      localStorage.setItem("userInfo", JSON.stringify(formData));
      console.error("Otp sent:", response.data.message);
      navigate("/verify-otp");
    } catch (error) {
      console.error(
        "Registration failed: ",
        error.response?.data?.message || error.message
      );
      setError(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#fff9f4] px-4">
      <form
        id="register-form"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-[#c85a32] mb-6">
          Create Account
        </h1>

        {error && (
          <p className="mb-4 text-red-600 text-center font-medium">{error}</p>
        )}

        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#dfa26d] outline-none transition"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#dfa26d] outline-none transition"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#dfa26d] outline-none transition"
            />
            <i
              className={`bx ${
                showPassword ? "bx-hide" : "bx-show"
              } absolute right-3 top-3.5 text-xl text-gray-600 cursor-pointer`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="registerBtn"
          type="submit"
          disabled={loading}
          className="w-full bg-[#dfa26d] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#e6b07c] transition-all duration-300 disabled:opacity-60"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Registering...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-[#c85a32] font-semibold hover:underline"
          >
            Login here
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Register;
