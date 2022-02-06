const Dotenv = require('dotenv').config({ path: `${__dirname}/config.env` });

const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    GEOCODER_KEY: process.env.GEOCODER_API_KEY,
    GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER
}

module.exports = ENV