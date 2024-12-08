import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: "",
    role: "Student", // Default role is 'Student'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle radio button change for role
  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://user-service:5001/api/v1/register",
        formData
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2 className="page-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
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
        <input
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          onChange={handleChange}
          required
        />
        {/* Radio buttons for selecting role */}
        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="Student"
              checked={formData.role === "Student"}
              onChange={handleRoleChange}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Admin"
              checked={formData.role === "admin"}
              onChange={handleRoleChange}
            />
            Admin
          </label>
        </div>
        <input
          name="contactNumber"
          placeholder="Contact Number"
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
