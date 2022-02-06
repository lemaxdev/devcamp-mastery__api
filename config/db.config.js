const Colors = require('colors');
const Mongoose = require('mongoose');

const ENV = require('./env.config');

const ConnectDB = async () => {
    const conn = await Mongoose.connect(ENV.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    console.log(`Connected to the database | ${conn.connection.host}`.yellow.inverse);
}

module.exports = ConnectDB