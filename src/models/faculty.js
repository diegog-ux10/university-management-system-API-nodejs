// models/Faculty.js
const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    name: String,
    email: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('Faculty', FacultySchema);
