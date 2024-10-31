const Faculty = require('../models/Faculty');

exports.getAllFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find();
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFacultyById = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.facultyId);
        if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createFaculty = async (req, res) => {
    try {
        const faculty = new Faculty(req.body);
        await faculty.save();
        res.status(201).json(faculty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndUpdate(req.params.facultyId, req.body, { new: true });
        res.json(faculty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteFaculty = async (req, res) => {
    try {
        await Faculty.findByIdAndDelete(req.params.facultyId);
        res.json({ message: "Faculty deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
