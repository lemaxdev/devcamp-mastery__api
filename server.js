const express = require('express');
const colors = require('colors');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const apicache = require('apicache');
const compression = require('compression');

const ENV = require('./config/env.config');
const connectDB = require('./config/db.config');
const CustomError = require('./utils/customError');
const errorHandler = require('./middleware/errors');

const bootcampsRouter = require('./routes/bootcamps');
const coursesRouter = require('./routes/courses');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const reviewsRouter = require('./routes/reviews');

const api = express();

// Compression middleware
api.use(compression());

// Caching middleware
// disable caching for POST, PUT, DELETE request method
const checkMethod = (req, res) => req.method === 'GET';
let cache = apicache.options({
    statusCodes: {
        include: [200]
    }
}).middleware

api.use(cache('5 minutes', checkMethod));

// Built-in middleware for body parsing JSON Content-Type
api.use(express.json());
// Cookie parser
api.use(cookieParser());

// Security middlewares
api.use(mongoSanitize());
api.use(helmet());
api.use(xss());
api.use(hpp());
api.use(cors());

// !!! Disable rate limiter for api performance tests 
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });
// api.use(limiter);

// FileUpload middleware
api.use(fileupload());

// Set static folder
api.use(express.static(path.join(__dirname, 'public')));

// Middleware for logging on requests, only for DEV
if (ENV.NODE_ENV === "development") {
    const morgan = require('morgan');
    api.use(morgan('dev'));
}

// Mount routers
api.use('/api/v1/bootcamps', bootcampsRouter);
api.use('/api/v1/courses', coursesRouter);
api.use('/api/v1/auth', authRouter);
api.use('/api/v1/admin', adminRouter);
api.use('/api/v1/reviews', reviewsRouter);

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
