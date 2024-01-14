const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const { passwordUpdated } = require("../mail/passwordUpdate")


//send otp
exports.sendotp = async (req,res) =>{
    try{
        const {email} = req.body;

        //check if user is already registered or not
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message:"User Already Exist."
            })
        }

        //generate otp
        let otp= otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated :", otp);

         //check unique otp or not
        let result = await OTP.findOne({otp:otp});

        //check until unique otp is not found
        while(result){
            otp= otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp});
        }

        const otpPayload = {email,otp};

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response successfull
        return res.status(200).json({
            success: true,
            message:"User OTP is created Successfully."
        })


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

//SignUp
exports.signup = async (req,res)=>{
    try{
        //data fetch from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body ;
        //validate 
        if( !firstName || !lastName || !email || !password || !accountType || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message:"All fields are required."
            })
        }
        //2 password match
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message:"Password and confirmPassword value does not match."
            })
        }
        //check user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false ,
                message:"User Already Exists"
            })
        }

        //find the most recent otp
        // const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        // if( recentOtp.length < 6){
        //     console.log("The recent otp: ",recentOtp);
            
        // }
        // }else if( otp !== recentOtp.otp){
        //     return res.status(400).json({
        //         success:false ,
        //         message:"Invalid OTP Entered by User."
        //     })
        // }

        // Find the most recent OTP for the email
        const response = await OTP.find({ email });
        console.log("The otp: ",response)
        if (response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
        })
        } else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
        })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);


        //entry create in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            accountType,
            password:hashedPassword,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}%20${lastName}`,
        });
        //return res.. 
        return res.status(200).json({
            success:true ,
            message:"User is Successfully Registered.",
            user
        });

    }catch(error){
        console.log("Error : ", error);
        return res.status(500).json({
            success: false,
            message:"User cannot be registered.Please try Again."
        })
    }
    
}

//login
exports.login = async(req,res)=>{
    try{
        //data fetch
        const {email,password} = req.body;

        //Valideted the request
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All field required.Please Fill properly"
            })
        }
        //check user exists or not
        let user = await User.findOne({email}).populate("additionalDetails").exec();
        if(!user){
            return res.status(401).json({
                success:false,
                message:"SignUp First ,then login."
            })
        }

        const payload = {
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        };

        //check password is correct or not and generate JWT token
        if(await bcrypt.compare(password,user.password)){
            //JWT Token
            let token = jwt.sign(payload,
                         process.env.JWT_Password,
                         {
                            expiresIn:"2h"
                         });
            

            user = user.toObject();
            user.token = token ;
            user.password = undefined ;
            

            const options = {
                expires: new Date(Date.now()+3*24*60*1000),
                httpOnly : true     
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully."
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            })
        }


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in Login. Try Again Later."
        })
    }
}

// Controller for Changing Password
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
            return res.status(401).json({
                success: false,
                message: "The password is incorrect" 
            })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        {userDetails},
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
            const emailResponse = await mailSender(
            updatedUserDetails.email,
            "Password for your account has been updated",
            passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
            )
            console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
            })
      }
  
      // Return success response
      return res.status(200).json({ 
        success: true, 
        message: "Password updated successfully" 
       })
       

    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
}