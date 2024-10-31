const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const {verifyToken} = require('../middlewares/verifyToken');

router.get('/', verifyToken, departmentController.getAllDepartments);
router.get('/:departmentId', verifyToken, departmentController.getDepartmentById);
router.post('/', verifyToken, departmentController.createDepartment);
router.put('/:departmentId', verifyToken, departmentController.updateDepartment);
router.delete('/:departmentId', verifyToken, departmentController.deleteDepartment);

module.exports = router;
