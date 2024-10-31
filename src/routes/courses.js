const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, courseController.getAllCourses);
router.get('/:courseId', verifyToken, courseController.getCourseById);
router.post('/', verifyToken, courseController.createCourse);
router.put('/:courseId', verifyToken, courseController.updateCourse);
router.delete('/:courseId', verifyToken, courseController.deleteCourse);

module.exports = router;
