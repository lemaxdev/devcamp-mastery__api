const Dotenv = require('dotenv').config({ path: './config/config.env' });
const Express = require('express');
const App = Express();

App.listen(
    process.env.PORT,
    console.log(`Server is up and running on <${process.env.NODE_ENV}> mode on port <${process.env.PORT}>`)
);