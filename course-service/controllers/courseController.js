const Course = require('../models/courseModel');
const User = require('../../user-service/models/userModel');
const axios = require('axios');

// Create a new course (Admin only)
exports.createCourse = async (req, res) => {
  const { title, description, instructor, duration, category, level, thumbnail, language } = req.body;

  try {
    const course = new Course({
      title,
      description,
      instructor,
      duration,
      category,
      level,
      thumbnail,
      language,
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation failed", errors: errorMessages });
    }
    res.status(500).json({ message: `Error creating course: ${error.message}` });
  }
};


// Get all courses (Student and Admin) with pagination and level-wise ordering
exports.getAllCourses = async (req, res) => {
  try {
    
  const rawPage = req.query.page;
  const rawLimit = req.query.limit;

  if (rawPage && (isNaN(rawPage) || rawPage <= 0)) {
    return res.status(400).json({ message: 'Invalid page value. Page must be a positive integer.' });
  }
  if (rawLimit && (isNaN(rawLimit) || rawLimit <= 0)) {
    return res.status(400).json({ message: 'Invalid limit value. Limit must be a positive integer.' });
  }

  const page = parseInt(rawPage) || 1;
  const limit = parseInt(rawLimit) || 10;

    const courses = await Course.aggregate([
      {
        $addFields: {
          levelOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$level", "Beginner"] }, then: 1 },
                { case: { $eq: ["$level", "Intermediate"] }, then: 2 },
                { case: { $eq: ["$level", "Advanced"] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      },
      { $sort: { levelOrder: 1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalCourses = await Course.countDocuments();

    res.json({
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
      courses
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching courses: ${error.message}` });
  }
};

// Get a particular course (Student and Admin)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: `Error fetching course: ${error.message}` });
  }
};

// Delete a course (Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(204).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting course: ${error.message}` });
  }
};

// Update a course (Admin only)
exports.updateCourse = async (req, res) => {
  const { title, description, instructor, duration, category, level, thumbnail, language } = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.instructor = instructor || course.instructor;
    course.duration = duration || course.duration;
    course.category = category || course.category;
    course.level = level || course.level;
    course.thumbnail = thumbnail || course.thumbnail;
    course.language = language || course.language;

    await course.save();
    res.status(201).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: `Error updating course: ${error.message}` });
  }
};



// Get users enrolled in a course (Admin only) and fetch user details using API
exports.getUsersEnrolledInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userIds = course.studentsEnrolled;

    // Fetch user details for each user ID using the user service API
    const userPromises = userIds.map(userId => 
      axios.get(`http://localhost:5001/api/v1/users/${userId}`, {
        headers: {
          Authorization: req.headers.authorization
        }
      })
    );

    const userResponses = await Promise.all(userPromises);
    const users = userResponses.map(response => {
      const { password, coursesEnrolled, ...userDetails } = response.data;
      return userDetails;
    });

    // Sort users by name in alphabetical order
    users.sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Error fetching enrolled users: ${error.message}` });
  }
};

// Enroll a student in a course
exports.enrollStudentInCourse = async (req, res) => {
  const { userId } = req.body;
  const courseId = req.params.id;
  const adminToken = req.headers.authorization; // Assuming the token is passed in the request headers


  try {
    // Fetch user details from the user service API
    // Fetch user details from the user service API with admin token
    const userResponse = await axios.get(`http://localhost:5001/api/v1/users/${userId}`, {
      headers: {
        Authorization: adminToken
      }
    });
    const user = User.hydrate(userResponse.data);
   

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify that the user is a student
    if (user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can be enrolled in courses' });
    }

    // Fetch course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Enroll the user in the course if not already enrolled
    if (course.studentsEnrolled.includes(user._id) || user.coursesEnrolled.includes(courseId)) {
      return res.status(409).json({ message: 'Student is already enrolled in this course' });
    }

  

   // Enroll the user in the course
   course.studentsEnrolled.push(userId);

   // Update the user's enrolled courses
   user.coursesEnrolled.push(course);

    await axios.put(`http://localhost:5001/api/v1/users/${userId}`, { coursesEnrolled: user.coursesEnrolled }, {
      headers: {
        Authorization: adminToken
      }
    });

    await course.save();

    res.status(200).json({ message: 'User enrolled in course successfully' });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: `Error enrolling user in course: ${error.message}` });
  }
};

// Get courses by level (Student and Admin)
exports.getCoursesByLevel = async (req, res) => {
  try {
    const level = req.params.level;
    const allowedLevels = ["Beginner", "Intermediate", "Advanced"];

    if (!allowedLevels.includes(level)) {
      return res.status(400).json({ message: "Invalid level parameter. Allowed values are: Beginner, Intermediate, Advanced." });
    }

    const courses = await Course.find({ level });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: `Error fetching courses by level: ${error.message}` });
  }
};

// De-enroll a student from a course
exports.deenrollStudentFromCourse = async (req, res) => {
  const { userId } = req.body;
  const courseId = req.params.id;
  const adminToken = req.headers.authorization; // Assuming the token is passed in the request headers

  try {
    // Fetch user details from the user service API with admin token
    const userResponse = await axios.get(`http://localhost:5001/api/v1/users/${userId}`, {
      headers: {
        Authorization: adminToken
      }
    });
    const user = userResponse.data;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the student is enrolled in the course
    if (!course.studentsEnrolled.includes(userId)) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }

    // De-enroll the user from the course
    course.studentsEnrolled = course.studentsEnrolled.filter(id => id.toString() !== userId);
    await course.save();

    // Update the user's enrolled courses
    user.coursesEnrolled = user.coursesEnrolled.filter(id => id.toString() !== courseId);
    await axios.put(`http://localhost:5001/api/v1/users/${userId}`, { coursesEnrolled: user.coursesEnrolled }, {
      headers: {
        Authorization: adminToken
      }
    });

    res.status(200).json({ message: 'User de-enrolled from course successfully' });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: `Error de-enrolling user from course: ${error.message}` });
  }
};