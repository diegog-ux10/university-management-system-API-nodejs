// routes/students.js
const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const ensureAuthenticated = require('../middlewares/auth');

// Crear estudiante
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obtener todos los estudiantes
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar estudiante
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar estudiante
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
