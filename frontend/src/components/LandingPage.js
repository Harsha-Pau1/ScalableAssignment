import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  //   const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("userDetails"))?._id;
  const userEmail = JSON.parse(localStorage.getItem("userDetails"))?.email; // Get user ID from localStorage

  useEffect(() => {
    console.log("LandingPage loaded");
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        alert("Please log in first.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://course-service:5002/api/v1/courses?page=${currentPage}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Courses API Response:", response.data);
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
        const userResponse = await axios.get(
          `http://user-service:5001/api/v1/users/email/${userEmail}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Update state with new user details
        //   setUserDetails(userResponse.data);

        // Save updated user details in localStorage
        localStorage.setItem("userDetails", JSON.stringify(userResponse.data));
      } catch (error) {
        console.error("Error fetching courses:", error.response?.data || error);
        alert("Failed to fetch courses. Please try again.");
      }
    };

    fetchCourses();
  }, [currentPage, navigate]);

  const handleEnroll = async (courseId) => {
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    try {
      const response = await axios.post(
        `http://course-service:5002/api/v1/courses/${courseId}/enroll`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const userResponse = await axios.get(
        `http://user-service:5001/api/v1/users/email/${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update state with new user details
      //   setUserDetails(userResponse.data);

      // Save updated user details in localStorage
      localStorage.setItem("userDetails", JSON.stringify(userResponse.data));

      // Update the course enrollment status in the UI
      updateEnrollButtonStatus(userResponse.data.coursesEnrolled);
      alert(response.data.message); // Show success message
    } catch (error) {
      console.error("Error enrolling in course", error);
      alert("Enrollment failed. Please try again.");
    }
  };

  const updateEnrollButtonStatus = (enrolledCourses) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => {
        const isEnrolled = enrolledCourses.some(
          (enrolledCourse) => enrolledCourse._id === course._id
        );
        return { ...course, isEnrolled };
      })
    );
  };

  return (
    <div>
      <h1>Courses</h1>
      <div style={styles.container}>
        {courses.map((course) => (
          <div
            key={course._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              margin: "10px",
              padding: "10px",
              width: "200px",
            }}
          >
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            <p>
              <strong>Level:</strong> {course.level}
            </p>
            <button
              style={{
                padding: "5px 10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => handleEnroll(course._id)}
              disabled={course.isEnrolled} // Disable button if already enrolled
            >
              {course.isEnrolled ? "Enrolled" : "Enroll"}
            </button>
          </div>
        ))}
      </div>
      <div style={styles.pagination}>
        <button
          style={styles.paginationButton}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          style={styles.paginationButton}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Styles for the tiles
const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    padding: "20px",
  },
  tile: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    width: "250px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  level: {
    fontSize: "14px",
    color: "#007BFF",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    position: "absolute",
    bottom: "20px",
    left: "20px",
    right: "20px",
  },
  paginationButton: {
    padding: "5px 15px", // Smaller padding for a smaller button
    fontSize: "14px", // Smaller font size
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    transition: "background-color 0.3s ease", // Smooth transition for hover effect
  },
};

export default LandingPage;
