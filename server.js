const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const path = require('path');

const ENV = require('./config/env.config');
const connectDB = require('./config/db.config');
const CustomError = require('./utils/customError');
const errorHandler = require('./middleware/errors');

const bootcampsRouter = require('./routes/bootcamps');
const coursesRouter = require('./routes/courses');

const api = express();
// Built-in middleware for body parsing JSON Content-Type
api.use(express.json());

// FileUpload middleware
api.use(fileupload());

// Set static folder
api.use(express.static(path.join(__dirname, 'public')));

// Middleware for logging on requests, only for DEV
if (ENV.NODE_ENV === "development") {
    api.use(morgan('dev'));
}

// Mount routers
api.use('/api/v1/bootcamps', bootcampsRouter);
api.use('/api/v1/courses', coursesRouter);
// Handle unmatched / invalid routes
api.use((req, res, next) => {
    next(new CustomError(`Invalid request <${req.method}> on route ${req.originalUrl}`, 404));
})

// Middleware for handling errors
api.use(errorHandler);

// Create server object to handle rejections
const server = api.listen(ENV.PORT, async () => {
    await connectDB(); // Try to connect to the database
    // Notify the server is running
    console.log(`API Server is up and running!`.green.inverse.bold);
    console.log(`MODE: ${ENV.NODE_ENV} | PORT: ${ENV.PORT}\n====================`.yellow);
});

// Handle promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Can't launch the server due to unexpected ERROR:`.magenta.inverse + `\n ${err}`.white);
    server.close(() => process.exit(1));
});
