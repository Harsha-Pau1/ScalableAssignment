const { authorizeAdmin } = require("../middleware/auth");
const User = require("../models/userModel");
const axios = require('axios');

//Completed working controller 
// Get user details
exports.getUserDetails = async (req, res) => {
  try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: `Error fetching user details: ${error.message}` });
  }
};



//Completed working for update of user details
// Update user details
exports.updateUserDetails = async (req, res) => {
  const { 
      name, username, email, role, coursesEnrolled, completedCourses,  contactNumber, address, preferences 
  } = req.body;

  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update user fields
      user.name = name || user.name;
      user.username = username || user.username;
      user.email = email || user.email;
      user.role = role || user.role;
      user.coursesEnrolled = coursesEnrolled || user.coursesEnrolled;
      user.completedCourses = completedCourses || user.completedCourses;
      user.contactNumber = contactNumber || user.contactNumber;
      user.address = address || user.address;
      user.preferences = preferences || user.preferences;

      await user.save();

      res.status(201).json({ message: 'User details updated successfully' });
  } catch (error) {
      res.status(500).json({ message: `Error updating user details: ${error.message}` });
  }
};

//Completed and working for delete user Admin only
// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      // If no user is found with the given ID
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: `Error deleting user: ${error.message}` });
  }
};


//Completed working for admin ->filter 
// Get user details by email (Admin only)
exports.getUserDetailsByEmail = [
  authorizeAdmin,
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email }).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: `Error fetching user details: ${error.message}` });
    }
  }
];

//Completed and working for admin
// Get all users (Admin only) with pagination, admins first then students
exports.getAllUsers = [
  authorizeAdmin,
  async (req, res) => {
    try {
       // Validate pagination values
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
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select('-password')
        .sort({ role: 1 }) // Sort by role, assuming 'admin' comes before 'student'
        .skip(skip)
        .limit(limit);
        
      const totalUsers = await User.countDocuments();

      res.status(200).json({
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        users
      });
    } catch (error) {
      res.status(500).json({ message: `Error fetching users: ${error.message}` });
    }
  }
];


//Completed and working for user student with required filed only 
// Get courses a student is enrolled in, sorted by level
exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch the user and populate their enrolled courses
    const user = await User.findById(userId).populate('coursesEnrolled');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Filter the courses to return only the specified fields
    const filteredCourses = user.coursesEnrolled.map(course => ({
      title: course.title,
      description: course.description,
      duration: course.duration,
      category: course.category,
      level: course.level
    }));

    res.status(200).json({ courses: filteredCourses });
  } catch (err) {
    console.error('Error fetching user courses:', err);
    res.status(500).json({ message: `Error fetching user courses: ${err.message}` });
  }
};


//Completed code  will also get the course completed 
// Get completed courses by a particular user
exports.getUserCompletedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('completedCourses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const courseIds = user.completedCourses;

    // Fetch course details for each course ID using the course service API
    const coursePromises = courseIds.map(courseId => 
      axios.get(`http://localhost:5002/api/v1/courses/${courseId}`, {
        headers: {
          Authorization: req.headers.authorization
        }
      })
    );

    const courseResponses = await Promise.all(coursePromises);
    const filteredCourses = courseResponses.map(response => {
      const { title, description, duration, category, level } = response.data;
      return { title, description, duration, category, level };
    });
    res.json({ completedCourses: filteredCourses });

  } catch (error) {
    res.status(500).json({ message: `Error fetching completed courses: ${error.message}` });
  }
};


//Controller working for admin
// Get all students (Admin only) with pagination and alphabetical order by name
exports.getAllStudents = async (req, res) => {
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
    const skip = (page - 1) * limit;


    const students = await User.find({ role: 'Student' })
      .select('-password')
      .sort({ name: 1 }) // Sort students by name in alphabetical order
      .skip(skip)
      .limit(limit);
      
    const totalStudents = await User.countDocuments({ role: 'Student' });

    res.status(200).json({
      totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
      students
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching students: ${error.message}` });
  }
};