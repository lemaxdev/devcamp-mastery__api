const Dotenv = require('dotenv').config({ path: './config/config.env' });

const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
}

module.exports = ENV