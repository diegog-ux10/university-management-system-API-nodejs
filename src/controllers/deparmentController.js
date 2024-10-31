const Department = require('../models/Department');

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.departmentId);
        if (!department) return res.status(404).json({ message: 'Department not found' });
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createDepartment = async (req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.departmentId, req.body, { new: true });
        res.json(department);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.departmentId);
        res.json({ message: "Department deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
