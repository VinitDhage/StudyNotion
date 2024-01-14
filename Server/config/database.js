const mongoose = require("mongoose");
require("dotenv").config();


exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("DB is created Successfully");
    })
    .catch((err)=>{
        console.log("DB connection is failed.")
        console.error(`Error: ${err}`);
        process.exit(1);
    })
}