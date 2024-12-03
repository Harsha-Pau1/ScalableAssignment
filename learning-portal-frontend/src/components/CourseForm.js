// CourseForm.js
import React, { useState } from "react";
import { courseAPI } from "../api";

const CourseForm = ({ fetchCourses }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Create a new course (POST /courses)
  const handleSubmit = async (e) => {
    e.preventDefault();
    await courseAPI.post("/courses", { title, description });
    fetchCourses(); // Refetch the course list after creation
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Course</h3>
      <input
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Course Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Create Course</button>
    </form>
  );
};

export default CourseForm;
