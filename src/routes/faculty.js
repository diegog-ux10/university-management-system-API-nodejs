const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const {verifyToken} = require('../middlewares/verifyToken');

router.get('/', verifyToken, facultyController.getAllFaculty);
router.get('/:facultyId', verifyToken, facultyController.getFacultyById);
router.post('/', verifyToken, facultyController.createFaculty);
router.put('/:facultyId', verifyToken, facultyController.updateFaculty);
router.delete('/:facultyId', verifyToken, facultyController.deleteFaculty);

module.exports = router;
