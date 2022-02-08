const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title to the course']
    },

    description: {
        type: String,
        required: [true, 'Please add a description to the course']
    },

    weeks: {
        type: String,
        required: [true, 'Please add how long this course takes in weeks']
    },

    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },

    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },

    scholarship: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    }
});

module.exports = new mongoose.model('Course', CourseSchema);