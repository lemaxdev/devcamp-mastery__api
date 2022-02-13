const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,

    GEOCODER_KEY: process.env.GEOCODER_API_KEY,
    GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER,

    FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
    MAX_FILE_SIZE_MB: process.env.MAX_FILE_SIZE_MB,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE
}

module.exports = ENV