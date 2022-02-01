const Express = require('express');
const App = Express();

const ENV = require('./config/env.config');
const ConnectDB = require('./config/db.config');
const Logger = require('morgan');
const BootcampsRouter = require('./routes/bootcamps');

// Connection to the database
ConnectDB();

// Middleware for logging on requests, only for DEV
if (ENV.NODE_ENV === 'development') {
    App.use(Logger('dev'));
}

App.use('/api/v1/bootcamps', BootcampsRouter);

App.listen(ENV.PORT, () => {
    console.log(`Server is up and running!`);
    console.log(`MODE: ${ENV.NODE_ENV} | PORT: ${ENV.PORT}\n====================`);
})