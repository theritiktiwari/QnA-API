const mongoose = require('mongoose');

// Connect to the database
const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URI).then(() => {
        console.log("Connected to the Database");
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = connectDB;