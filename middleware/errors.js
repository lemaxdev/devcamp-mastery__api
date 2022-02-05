const errorHandler = (err, req, res, next) => {
    let errObj = { statusCode: 500, error: 'SERVER ERROR' };

    // Mongoose ValidationError > required field not provided
    if (err.name === 'ValidationError') {
        const msg = Object.values(err.errors).map(val => val.message);
        errObj = {
            statusCode: 400,
            error: {
                name: 'Required field(s) not provided',
                message: msg
            }
        }
    }

    // Mongoose Duplicate key error > unique field required
    if (err.code == 11000) {
        errObj = {statusCode: 400, error: 'Duplicate field value entered'};
    }

    // Mongoose bad _id format
    if (err.name === 'CastError') {
        errObj = { statusCode: 404, error: `Can't find a bootcamp with ID ${err.value}` };
    }

    // Send the response after handling the error
    res.status(errObj.statusCode).json({
        success: false,
        error: errObj.error
    });

    // DEBUGGIN FOR DEV
    console.log(err)
}

module.exports = errorHandler;