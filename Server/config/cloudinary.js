const cloudinary = require("cloudinary").v2;

require('dotenv').config();


exports.cloudinaryConnect = ()=>{
    try{
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLODINARY_APIKEY,
            api_secret: process.env.CLODINARY_SECRET
        })
    }
    catch(error){
        console.log(error);
    }
}