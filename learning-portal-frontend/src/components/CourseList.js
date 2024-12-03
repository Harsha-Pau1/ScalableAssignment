// CourseList.js
import React, { useState, useEffect } from "react";
import { courseAPI } from "../api";
import CourseForm from "./CourseForm";
import CourseDetails from "./CourseDetails";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Fetch all courses (GET /courses)
  const fetchCourses = async () => {
    const response = await courseAPI.get("/courses");
    setCourses(response.data);
  };

  // Delete a course (DELETE /courses/:id)
  const handleDelete = async (id) => {
    await courseAPI.delete(`/courses/${id}`);
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h2>Course List</h2>
      <CourseForm fetchCourses={fetchCourses} />
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            {course.title} - {course.description}
            <button onClick={() => handleDelete(course._id)}>Delete</button>
            <button onClick={() => setSelectedCourseId(course._id)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      {selectedCourseId && (
        <CourseDetails
          courseId={selectedCourseId}
          fetchCourses={fetchCourses}
        />
      )}
    </div>
  );
};

export default CourseList;
