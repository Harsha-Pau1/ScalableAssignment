const express = require('express');
const progressController = require('../controllers/progressController');
const { authenticate, authorizeStudentOrAdmin ,authorizeAdmin} = require('../middleware/auth');

const router = express.Router();

// API versioning
const apiVersion = '/v1';

// Progress routes
router.post(`${apiVersion}/progress`, authenticate, authorizeStudentOrAdmin, progressController.createProgress);

router.get(`${apiVersion}/progress/user/:userId`, authenticate, authorizeStudentOrAdmin, progressController.getAllProgressForUser);
router.get(`${apiVersion}/progress/course/:courseId`, authenticate, authorizeAdmin, progressController.getAllProgressForCourse);


//Get Current progress for user for a particular course 
router.get(`${apiVersion}/progress/:userId/:courseId`, authenticate, authorizeStudentOrAdmin, progressController.getProgress);
//Update the current progress 
router.put(`${apiVersion}/progress/:userId/:courseId`, authenticate, authorizeStudentOrAdmin, progressController.updateProgress);
//Delete or Reset the request for the user and course both
router.delete(`${apiVersion}/progress/:userId/:courseId`, authenticate, authorizeStudentOrAdmin, progressController.deleteProgress);
//pagination routes 


module.exports = router;