const CustomError = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
    // Mongoose ValidationError
    if (err.name === 'ValidationError') {
        const msg = Object.values(err.errors).map(val => val.message);
        err = new CustomError(`Validation FAIL > ${msg}`, 400);
    }

    // Mongoose Duplicate key error
    if (err.code == 11000) {
        const field = Object.keys(err.keyValue);
        err = new CustomError(`Duplicate field value for <${field}>`, 400);
    }

    // Mongoose CastErrors for bad type format of values
    if (err.name === 'CastError') {
        err = new CustomError('Wrong type params', 400);
    }

    // Send the response after handling the error
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'INTERNAL SERVER ERROR'
    });
}

module.exports = errorHandler;