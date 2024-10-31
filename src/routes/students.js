const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/auth');
const studentController = require('../controllers/studentController');

// Crear estudiante
router.post('/', ensureAuthenticated, studentController.createStudent);

// Obtener todos los estudiantes
router.get('/', studentController.getAllStudents);

// Actualizar estudiante
router.put('/:id', ensureAuthenticated, studentController.updateStudent);

// Eliminar estudiante
router.delete('/:id', ensureAuthenticated, studentController.deleteStudent);

module.exports = router;