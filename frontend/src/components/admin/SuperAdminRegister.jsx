import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
const SuperAdminRegister = () => {
    const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post(
        "/api/admin/super-admin/register",
        form
      );
      setMsg(res.data.message);
      navigate("/login")
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Super Admin Register
        </h2>

        {["name", "email", "password", "secretKey"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field.toUpperCase()}
            onChange={handleChange}
            className="w-full mb-3 p-3 border rounded"
            required
          />
        ))}

        {msg && <p className="text-center text-red-500">{msg}</p>}

        <button className="w-full bg-black text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default SuperAdminRegister;
