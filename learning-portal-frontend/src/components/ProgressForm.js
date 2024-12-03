// ProgressForm.js
import React, { useState } from "react";
import { progressAPI } from "../api";

const ProgressForm = ({ fetchProgress }) => {
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [completed, setCompleted] = useState(false);

  // Track progress (POST /progress)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userId && courseId) {
      // Check if the progress exists, if so, update it
      try {
        // First, check if the progress exists (GET /progress/:userId/:courseId)
        const response = await progressAPI.get(
          `/progress/${userId}/${courseId}`
        );
        if (response.data) {
          // Progress exists, so update it (PUT /progress/:userId/:courseId)
          await progressAPI.put(`/progress/${userId}/${courseId}`, {
            completed,
          });
        } else {
          // Progress doesn't exist, create it (POST /progress)
          await progressAPI.post("/progress", { userId, courseId, completed });
        }
        fetchProgress(); // Refetch progress after tracking
      } catch (error) {
        console.error("Error tracking progress:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Track Progress</h3>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        required
      />
      <label>
        Completed:
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
      </label>
      <button type="submit">Track Progress</button>
    </form>
  );
};

export default ProgressForm;
