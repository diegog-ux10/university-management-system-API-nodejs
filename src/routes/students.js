const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const verifyToken = require('../middlewares/verifyToken'); // Asegúrate de que este middleware es una función

// Crear estudiante
router.post('/', verifyToken, studentController.createStudent);

// Obtener todos los estudiantes
router.get('/', verifyToken, studentController.getAllStudents);

// Actualizar estudiante
router.put('/:id', verifyToken, studentController.updateStudent);

// Eliminar estudiante
router.delete('/:id', verifyToken, studentController.deleteStudent);

module.exports = router;
