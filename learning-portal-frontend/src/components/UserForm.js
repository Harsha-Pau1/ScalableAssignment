// UserForm.js
import React, { useState } from "react";
import { userAPI } from "../api";

const UserForm = ({ fetchUsers }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Create a new user (POST /users)
  const handleSubmit = async (e) => {
    e.preventDefault();
    await userAPI.post("/users", { username, email, password });
    fetchUsers(); // Refetch the users list after creation
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create User</h3>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Create User</button>
    </form>
  );
};

export default UserForm;
