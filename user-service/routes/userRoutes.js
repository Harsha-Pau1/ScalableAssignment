const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { authorizeAdmin, authorizeStudentOrAdmin , authenticateToken } = require("../middleware/auth");

const router = express.Router();

// API versioning
const apiVersion = '/v1';

// User Register endpoints
router.post(`${apiVersion}/register`, authController.registerUser);
// User Login Route
router.post(`${apiVersion}/login`, authController.loginUser);

// User endpoints
router.get(`${apiVersion}/users`, authenticateToken, authorizeAdmin, userController.getAllUsers);
router.get(`${apiVersion}/users/:id`,authenticateToken, authorizeStudentOrAdmin,userController.getUserDetails);

router.put(`${apiVersion}/users/:id`, authenticateToken,authorizeStudentOrAdmin,userController.updateUserDetails);

router.delete(`${apiVersion}/users/:id`, authenticateToken,authorizeAdmin, userController.deleteUser);
router.get(`${apiVersion}/users/email/:email`, authenticateToken,authorizeAdmin, userController.getUserDetailsByEmail);


//route to get courses a student is enrolled in
router.get(`${apiVersion}/users/:id/courses`, authenticateToken,authorizeStudentOrAdmin, userController.getUserCourses);
// Route to get completed courses by a particular user
router.get(`${apiVersion}/users/:id/completed-courses`, authenticateToken,authorizeStudentOrAdmin, userController.getUserCompletedCourses);

// Route to get all students ->filter
router.get(`${apiVersion}/students`, authenticateToken, authorizeAdmin, userController.getAllStudents);



module.exports = router;