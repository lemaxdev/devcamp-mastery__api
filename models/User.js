const mongoose = require('mongoose');
const encrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Add a name'],
        unique: true
    },

    email: {
        type: String,
        required: [true, 'Add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Add a valid email address']
    },

    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'Add a password'],
        minlength: 6,
        select: false
    },

    resetPasswordToken: String,

    resetPasswordExpire: Date,

    createAt: {
        type: Date,
        default: Date.now
    }
});

// Ecrypt passwords
UserSchema.pre('save', async function (next) {
    this.password = await encrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);