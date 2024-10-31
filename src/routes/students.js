const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/auth');
const studentController = require('../controllers/studentController');
const verifyToken = require('../middlewares/verifyToken');

// Crear estudiante
router.post('/', ensureAuthenticated, verifyToken, studentController.createStudent);

// Obtener todos los estudiantes
router.get('/', studentController.getAllStudents);

// Actualizar estudiante
router.put('/:id', ensureAuthenticated, verifyToken, studentController.updateStudent);

// Eliminar estudiante
router.delete('/:id', ensureAuthenticated, verifyToken, studentController.deleteStudent);

module.exports = router;