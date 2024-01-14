const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");


//createRating
exports.createRating = async(req,res)=>{
    try{
        //get user id
        const userId = req.user.id;
        //fetch data from req body
        const {rating,review,courseId} = req.body;

        //check if user is enrolled or not..
        const courseDetails = await Course.findOne(
            {_id:courseId,
            studentsEnrolled:{$eleMatch :{$eq:userId}}}
        );

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in this course."
            })
        }

        //check user already reviewed
        let alreadyReview = await RatingAndReview.findOne({userId:userId,courseId:courseId});

        if(alreadyReview){
            return res.status(404).json({
                success:false,
                message:"Student already Reviewed this course."
            })
        }
        
        //create rating and review
        const ratingReview = await RatingAndReview.create({
            user:userId,
            rating,review,
            course:courseId
        })

        //update the course with this rating
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id:courseId},
            {
                $push:{ratingAndReviews:ratingReview._id}
            },
            {new:true}
        );

        console.log(updatedCourseDetails);
        

        //return response
        return res.status(200).json({
            success:true,
            message:"Student Reviewed this course Successfully."
        })

    }catch(error){
        console.log('Error in create rating', error);
        return res.status(500).json({
            success:false,
            message:"Some Error in Reviewing this course."
        })
    }
}


//getAverageRating
exports.getAverageRating = async(req,res)=>{
    try{
        //get Course Id
        const courseId = req.body.courseId ;

        //calculate Avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course:new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:'rating'}
                }
            }
        ])

        //return
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating
            })
        }

        //if no review exist
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no rating given till now",
            averageRating:0
        })

    }catch(error){
        console.log('Error in Average rating', error);
        return res.status(500).json({
            success:false,
            message:"Some Error in Average Rating this course."
        })
    }
}


//getAllRating
exports.getAllRatingReview=async (req,res) =>{
    try{
        const allReviews = await RatingAndReview.find({})
                                                .sort({rating:"desc"})
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image"
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName",
                                                })
                                                .exec();
                                                
        return res.status(200).json({
            success:true,
            message:"All reviews fetchec successfully.",
            data:allReviews
        })
    }catch(error){
        console.log('Error in fetching rating', error);
        return res.status(500).json({
            success:false,
            message:"Some Error in fetching Rating of this course."
        })
    } 
}