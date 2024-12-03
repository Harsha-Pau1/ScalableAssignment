// UserDetails.js
import React, { useState, useEffect } from "react";
import { userAPI } from "../api";

const UserDetails = ({ userId, fetchUsers }) => {
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    // Fetch user details by ID (GET /users/:id)
    const fetchUser = async () => {
      const response = await userAPI.get(`/users/${userId}`);
      setUser(response.data);
    };
    fetchUser();
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await userAPI.put(`/users/${userId}`, user); // Update user (PUT /users/:id)
    fetchUsers(); // Refetch the users list
  };

  return (
    <form onSubmit={handleUpdate}>
      <h3>Edit User</h3>
      <input
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        required
      />
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        required
      />
      <button type="submit">Update User</button>
    </form>
  );
};

export default UserDetails;
