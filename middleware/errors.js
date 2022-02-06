const CustomError = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
    // // Mongoose ValidationError
    if (err.name === 'ValidationError') {
        const msg = Object.values(err.errors).map(val => val.message);
        err = new CustomError(`Validation FAIL > ${msg}`, 400);
    }

    // Mongoose Duplicate key error
    if (err.code == 11000) {
        // const key = Object.values(err.keyValue);
        err = new CustomError(`Duplicate field value for 'name = ${err.keyValue.name}'`, 400);
    }

    // Mongoose bad _id format
    if (err.name === 'CastError') {
        const model = err.message.split('model ')[1];
        err = new CustomError(`Not found any ${model.toUpperCase()} with ID: ${err.value}`, 404);
    }

    // Send the response after handling the error
    res.status(err.statusCode).json({
        success: false,
        error: err.message
    });
}

module.exports = errorHandler;