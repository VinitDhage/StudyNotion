const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type : Date,
        default:Date.now(),
        expires:5*60, 
    },
    
});


async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email From StudyNotion: ",
        emailTemplate(otp));
        console.log("Email Sent Successfully:",mailResponse);

    }
    catch(error){
        console.log("Error Occured while Sending the mail: ",error);
        throw error;
    }
}


OTPSchema.pre("save",async function(next){

    // Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
})


module.exports = mongoose.model('OTP',OTPSchema);