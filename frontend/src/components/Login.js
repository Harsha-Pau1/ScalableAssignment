import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://user-service:5001/api/v1/login",
        credentials
      );
      localStorage.setItem("token", response.data.token);
      alert(response.data.message);
      // Now use the token to fetch user details based on email
      const token = localStorage.getItem("token");
      const userDetailsResponse = await axios.get(
        `http://user-service:5001/api/v1/users/email/${credentials.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem(
        "userDetails",
        JSON.stringify(userDetailsResponse.data)
      );

      navigate("/landing");
    } catch (error) {
      console.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        type="email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
