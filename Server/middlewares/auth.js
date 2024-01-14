const jwt = require("jsonwebtoken");
require("dotenv").config();


//auth
exports.auth = (req,res,next)=>{
    try{
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

        if(!token || token === undefined){
            return res.status(401).json({
                success:false,
                message:"Token is not available."
            })  
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_Password);
            console.log(decode);
            req.user = decode;

        }catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            })
        }
        next();

    }catch(error){
        res.status(401).json({
            success:false,
            message:"Something went Wrong in Authentication..."
        })
    }
}



//isStudent
exports.isStudent = (req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            res.status(401).json({
                success:false,
                message:"This is Protected Route for Student."
            })
        }
        next();
    }catch(error){
        res.status(401).json({
            success:false,
            message:"User Role can't Matching"
        })
    }
}


//isInstructor
exports.isInstructor = (req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            res.status(401).json({
                success:false,
                message:"This is Protected Route for Instructor."
            })
        }
        next();
    }catch(error){
        res.status(401).json({
            success:false,
            message:"User Role can't Matching"
        })
    }
}


//isAdmin
exports.isAdmin = (req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            res.status(401).json({
                success:false,
                message:"This is Protected Route for Admin."
            })
        }
        next();

    }catch(error){
        res.status(401).json({
            success:false,
            message:"User Role can't Matching"
        })
    }
}