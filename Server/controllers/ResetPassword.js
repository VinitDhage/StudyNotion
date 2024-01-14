// const { response } = require("express");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto")


//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try{
        //get email from req body
        const email = req.body.email;

        //check user exist or not
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(401).json({
                success: false,
                message:"User is not Register...(ResetPassword)"
            })
        }

        //generate token
        const token = crypto.randomUUID();

        //save this token in the database with expire time 5 min
        const updatedDetails = await User.findOneAndUpdate({email:email},
                                                {
                                                    token:token,
                                                    resetPasswordExpires:Date.now()+5*60*1000
                                                },
                                                {new:true});
        
        //create URL
        const url = `http://localhost:3000/update-password/${token}`;
        //send Email to user for Reset Password
        await mailSender(email,"Password Reset Link",`Password Reset Link: ${url}`)

        //return response
        return res.status(200).json({
            success:true,
            message:"Email Sent Successfully,Please check email and chnage password."
        })                
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went Wrong,While sending reset password link."
        })
    }
}


//resetPassword
exports.resetPassword = async (req,res) =>{
    try{
        //get token & new password from req body
        const {password,confirmPassword,token} = req.body;

        //validation
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password not Matching."
            })
        }

        //get userDetail from DB
        const userDetails = await User.findOne({token:token});

        //if no entry, then invalid token
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"Token is Invalid for Reset Password."
            })
        }

        //token time out
        if( userDetails.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success:false,
                message:"Token is Expired.."
            })
        }

        //hash Password
        const hashedPassword = await bcrypt.hash(password,10);

        // Update Password in Db
        await User.findOneAndUpdate({token:token},
                                {
                                    password:hashedPassword
                                },
                                {new:true})

        // return response 
        return res.status(200).json({
            success: true,
            message:"Password Successfully Reset."
        })

    }catch(error){
        console.log("Error In Reseting The Password : ", error);
        return res.status(500).json({
            success:false,
            message:"Something went Wrong,While Reset Password"
        })
    }
}