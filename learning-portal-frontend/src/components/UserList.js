// UserList.js
import React, { useState, useEffect } from "react";
import { userAPI } from "../api";
import UserForm from "./UserForm";
import UserDetails from "./UserDetails";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch all users (GET /users)
  const fetchUsers = async () => {
    const response = await userAPI.get("/users");
    setUsers(response.data);
  };

  // Delete a user (DELETE /users/:id)
  const handleDelete = async (id) => {
    await userAPI.delete(`/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <UserForm fetchUsers={fetchUsers} />
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username} - {user.email}
            <button onClick={() => handleDelete(user._id)}>Delete</button>
            <button onClick={() => setSelectedUserId(user._id)}>Edit</button>
          </li>
        ))}
      </ul>
      {selectedUserId && (
        <UserDetails userId={selectedUserId} fetchUsers={fetchUsers} />
      )}
    </div>
  );
};

export default UserList;
