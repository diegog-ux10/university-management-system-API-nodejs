const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {verifyToken} = require('../middlewares/verifyToken');

router.post('/', verifyToken, studentController.createStudent);

router.get('/', verifyToken, studentController.getAllStudents);

router.get('/:id', verifyToken, studentController.getStudent);

router.put('/:id', verifyToken, studentController.updateStudent);

router.delete('/:id', verifyToken, studentController.deleteStudent);

module.exports = router;
