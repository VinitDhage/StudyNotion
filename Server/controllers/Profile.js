const Profile = require("../models/Profile");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")

exports.updateProfile = async (req,res)=>{
    try{
        //get data
        const{gender,dateOfBirth="",about="",contactNumber}=req.body;

        //get userId
        const id = req.user.id;

        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                msg:"Please fill all fields"
            });
        }

        //find profile..
        const userDetails = await  User.findById(id);
        const profileId= userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update Profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();


        //return response
        return res.status(200).json({
            success:true,
            message:"Profile is Updated Successfully..",
            profileDetails
        })

    }catch(error){
        console.log('Error in update profile', error);
        return res.status(500).json({
            success:false,
            message:"Error in Updation of Profile."
        })
    }
}


//delete Profile i.e delete account
exports.deleteAccount = async (req,res)=>{
    try{
        const id = req.user.id;

        //validation
        const userDetails = await User.findById(id);
        const profileId= userDetails.additionalDetails;
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"There some issue in User ID for Deletion.."
            })
        }
        //delete profile
        await Profile.findOneAndDelete({_id:profileId});

        //now deleting the user from users collection
        await User.findByIdAndDelete({_id:id});


        //TODO ---> H.W  unenroll user from all enrolled courses..


        //return response..
        return res.status(200).json({
            success: true,
            message:"The User is Deleted Successfully."
        })
    }catch(error){
        console.log("Error in deleting Account ", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete the account!"
        })
    }
}

//user Details fetch
exports.getAllUserDetails = async (req,res)=>{
    try{
        //get id
        const id = req.user.id;

        //validation and get user detail..
        const userDetails = await User.findById(id).populate('additionalDetails').exec();


        //return response..
        return res.status(200).json({
            success: true,
            userDetails,
            message:"The User is Fetch Successfully."
        })

    }catch(error){
        console.log("Error in Fetching User Details :", error);
        return res.status(500).json({
            success: false,
            message: "Unable to Fetch the details of account!"
        })
    }
}


exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      console.log("Some error: ", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({_id: userId})
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()

      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}
  
exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
}