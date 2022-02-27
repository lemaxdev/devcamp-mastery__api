const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the review'],
        maxlength: [50, 'Title can not exceed 50 characters'],
        trim: true,
    },

    text: {
        type: String,
        required: [true, 'Please add a text'],
    },

    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 10'],
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must be at most 10'],
    },

    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Review', ReviewSchema);