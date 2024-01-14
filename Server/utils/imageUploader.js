const cloudinary = require("cloudinary").v2 ;
require("dotenv").config();

// function isFileSupported(fileType,supportedType){
//     return supportedType.includes(fileType) ? true : false ;
// }


exports.uploadImageToCloudinary = async(file,folder,height,quality)=>{
    const option = {folder};
    if(quality){
        option.quality = quality;
    }
    if(height){
        option.height = height;
    }
    option.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath,option);
}



// exports.imageUpload = async(req,res)=>{
//     try{
//         //data  fetch 
//         const {name,tags,email} = req.body;
//         console.log(name,tags,email);

//         //fetch image url;
//         const file = req.files.imagefile;
//         console.log("Image Url--->", file)

//         //Validation
//         const supportedType = ['jpg','jpeg','png'];
//         const fileType = file.name.split('.')[1].toLowerCase();
//         console.log(fileType);

//         if(!isFileSupported(fileType,supportedType)){
//             res.status(400).send({
//                 success:false,
//                 error: 'Wrong Image Type. Plz send Supported Image.'
//             })
//         }

//         //now send to cloudinary
//         const response = await uploadToCloudinary(file,"codehelp");

//         //successfull;

//         res.status(200).json({
//             success:true,
//             message:"Image is uploaded Successfully."
//         })
//     }
//     catch(error){
//         console.log(error);
//         return res.status(400).send({
//             success:false,
//             error: 'Image could not be uploaded'
//         })
//     }
// }
