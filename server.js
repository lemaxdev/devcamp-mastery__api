const express = require("express");
const colors = require("colors");

const ENV = require("./config/env.config");
const ConnectDB = require("./config/db.config");
const Logger = require("morgan");

const errorHandler = require('./middleware/errors');

const bootcampsRouter = require("./routes/bootcamps");
const coursesRouter = require('./routes/courses');

const api = express();

// Middleware for logging on requests, only for DEV
if (ENV.NODE_ENV === "development") {
    api.use(Logger("dev"));
}

// Built-in middleware for body parsing JSON Content-Type
api.use(express.json());

// Mount routers
api.use("/api/v1/bootcamps", bootcampsRouter);
api.use('/api/v1/courses', coursesRouter);

// Handle unmatched / invalid routes
api.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Invalid request ${req.method} on route ${req.originalUrl}`
    })
})

// Middleware for handling errors
api.use(errorHandler);

const server = api.listen(ENV.PORT, async () => {
    await ConnectDB(); // Try to connect to the database
    // Launch the server
    console.log(`API Server is up and running!`.cyan.inverse);
    console.log(`MODE: ${ENV.NODE_ENV} | PORT: ${ENV.PORT}\n====================`.green);
});

// Handle promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Can't launch the server due to unexpected ERROR:`.magenta + `\n ${err}`.white);
    server.close(() => process.exit(1));
});
