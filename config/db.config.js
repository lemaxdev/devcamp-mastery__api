const mongoose = require('mongoose');

const ENV = require('./env.config');

const DBConnect = async () => {
    const conn = await mongoose.connect(ENV.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    console.log(`Connected to the database | ${conn.connection.host}`);
}

module.exports = DBConnect