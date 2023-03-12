const mongoose = require('mongoose');
const colors = require('colors');

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected ${mongoose.connection.host}`.bgCyan.white);
    } catch (error) {
        console.log(`MONGODB server issues:${error}`.bgRed.black);
    }
}

module.exports = ConnectDB;