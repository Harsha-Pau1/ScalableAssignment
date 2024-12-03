// CourseDetails.js
import React, { useState, useEffect } from "react";
import { courseAPI } from "../api";

const CourseDetails = ({ courseId, fetchCourses }) => {
  const [course, setCourse] = useState({ title: "", description: "" });

  useEffect(() => {
    // Fetch course details by ID (GET /courses/:id)
    const fetchCourse = async () => {
      const response = await courseAPI.get(`/courses/${courseId}`);
      setCourse(response.data);
    };
    fetchCourse();
  }, [courseId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Update the course (PUT /courses/:id)
    await courseAPI.put(`/courses/${courseId}`, course);
    fetchCourses(); // Refetch the course list after updating
  };

  return (
    <form onSubmit={handleUpdate}>
      <h3>Edit Course</h3>
      <input
        type="text"
        value={course.title}
        onChange={(e) => setCourse({ ...course, title: e.target.value })}
        required
      />
      <input
        type="text"
        value={course.description}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
        required
      />
      <button type="submit">Update Course</button>
    </form>
  );
};

export default CourseDetails;
