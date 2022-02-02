const Mongoose = require('mongoose');

const BootcampSchema = new Mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not exceed 50 characters']
    },

    slug: {
        type: String
    },

    description: {
        type: String,
        require: [true, 'Description is required'],
        maxlength: [500, 'Description can not exceed 500 characters'],
    },

    website: {
        type: String,
        match: [
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
            'Add a valid website address'
        ]
    },

    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },

    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Add a valid email address'
        ]
    },

    address: {
        type: String,
        require: [true, 'Add an address']
    },

    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'UI/UX',
            'Business',
            'Mobile Development',
            'Data Science',
            'Other'
        ]
    },

    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must be at most 10'],
    },

    averageCost: {
        type: Number
    },

    photo: {
        type: String,
        default: 'no-photo.jpg'
    },

    housing: {
        type: Boolean,
        default: false
    },

    jobAssistance: {
        type: Boolean,
        default: false
    },

    jobGuarantee: {
        type: Boolean,
        default: false
    },

    acceptGi: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = Mongoose.model('Bootcamp', BootcampSchema);