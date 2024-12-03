// ProgressList.js
import React, { useState, useEffect } from "react";
import { progressAPI } from "../api";

const ProgressList = ({ userId, courseId }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    // Fetch the progress of the user in a specific course (GET /progress/:userId/:courseId)
    const fetchProgress = async () => {
      try {
        const response = await progressAPI.get(
          `/progress/${userId}/${courseId}`
        );
        setProgress(response.data); // Assuming the response contains the progress data
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    if (userId && courseId) {
      fetchProgress();
    }
  }, [userId, courseId]);

  if (!progress) {
    return <p>Loading progress...</p>;
  }

  return (
    <div>
      <h3>
        Progress for User {userId} in Course {courseId}
      </h3>
      <p>{progress.completed ? "Completed" : "Not Completed"}</p>
    </div>
  );
};

export default ProgressList;
