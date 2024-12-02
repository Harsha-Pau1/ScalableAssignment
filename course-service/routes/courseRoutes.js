const express = require('express');
const courseController = require('../controllers/courseController');
const { authenticate, authorizeAdmin ,authorizeStudentOrAdmin} = require('../middleware/auth');

const router = express.Router();

// API versioning
const apiVersion = '/v1';

// Course routes
router.post(`${apiVersion}/courses`, authenticate, authorizeAdmin, courseController.createCourse);
router.get(`${apiVersion}/courses`, authenticate,authorizeStudentOrAdmin, courseController.getAllCourses);
router.get(`${apiVersion}/courses/:id`, authenticate,authorizeStudentOrAdmin, courseController.getCourseById);
router.delete(`${apiVersion}/courses/:id`, authenticate, authorizeAdmin, courseController.deleteCourse);
router.put(`${apiVersion}/courses/:id`, authenticate, authorizeAdmin, courseController.updateCourse);

//Only admin can get what all students are enrolled for course 
router.get(`${apiVersion}/courses/:id/enrolledStudents`, authenticate, authorizeAdmin, courseController.getUsersEnrolledInCourse);
// Route to enroll a student in a course
router.post(`${apiVersion}/courses/:id/enroll`, authenticate, authorizeStudentOrAdmin, courseController.enrollStudentInCourse);
// Route to filter courses by level
router.get(`${apiVersion}/courses/level/:level`, authenticate, authorizeStudentOrAdmin, courseController.getCoursesByLevel);

// Route to de-enroll a student from a course
router.post(`${apiVersion}/courses/:id/deregister`, authenticate, authorizeStudentOrAdmin, courseController.deenrollStudentFromCourse);


module.exports = router;