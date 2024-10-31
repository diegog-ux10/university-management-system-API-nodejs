const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: String,
    code: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }]
});

module.exports = mongoose.model('Course', CourseSchema);
