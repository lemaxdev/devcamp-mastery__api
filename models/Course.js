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
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Calculate the averageCost for bootcamp
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const cost = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    // Update averageCost field on Bootcamp
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(cost[0].averageCost)
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageCost everytime after save a doc and before remove a doc
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});
CourseSchema.pre('remove', function (next) {
    this.constructor.getAverageCost(this.bootcamp);
    next();
});

module.exports = mongoose.model('Course', CourseSchema);