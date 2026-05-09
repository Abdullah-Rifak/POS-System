import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import Logger from "../../services/logger";
import "../styles/login.css"


const Login = () => {
  const [form, setForm] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/auth/login", form);
      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      Logger.info(`Login successful for user: ${user.role}`);

      if (user.role === "Admin") navigate("/admin/dashboard");
      else if (user.role === "Salesman") navigate("/salesman/stock");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed - Please check your connection";
      setError(errorMessage);
      Logger.error("Login failed", err);
    }
  };

  return (
    <div className="login-wrapper">
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="User Name"
          value={form.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
    </div>
  );
};

export default Login;
