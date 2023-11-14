const colors = require('colors');
const mongoose = require('mongoose');

const ENV = require('./env.config');

async function connectDB() {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(ENV.DB_URI);

    console.log('Succesfully connected to the database server!'.green.inverse.bold);
}

module.exports = connectDB; 