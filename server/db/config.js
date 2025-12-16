const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = ()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("Database connected successfully");
    }).catch((err)=>{
        console.log("error occured while connecting DB", err)
    })
}

module.exports = connectDB;