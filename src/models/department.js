const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: String,
    code: String,
    faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('Department', DepartmentSchema);
