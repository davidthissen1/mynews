import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login..."); // Debug log
    console.log("Email:", email, "Password:", password); // Debug log
    try {
      const response = await fetch("http://localhost:5501/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response from server:", data); // Debug log

      if (response.ok) {
        localStorage.setItem("token", data.token); // Save token to localStorage
        console.log("Token saved to localStorage:", data.token); // Debug log

        navigate("/news"); // Redirect to the news feed
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />
        <button type="submit" style={{ padding: "10px", margin: "10px 0" }}>
          Login
        </button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {/* Register button */}
      <button onClick={() => navigate("/register")} style={{ padding: "10px" }}>
        Register
      </button>
    </div>
  );
};

export default Login;
