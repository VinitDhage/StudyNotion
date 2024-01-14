const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/Subsection")

exports.createSection = async(req,res)=>{
    try{
        const {sectionName,courseId} = req.body;

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                msg:"Please enter all fields"
            })
        };

        //create Section
        const newSection = await Section.create({sectionName});

        //update Course with section ObjectID
        const updatedCourseDetails =await Course.findByIdAndUpdate(courseId,
            {
                $push:{courseContent:newSection._id}
            },
            {new:true}
        ).populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
        })
        .exec();

        //return response
        return res.status(200).json({
            success: true,
            message:"Section Created Successfully.",
            data:updatedCourseDetails
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Error in Section Creation.",
        })
    }
}


exports.updateSection = async(req,res)=>{
    try{
        //data input
        const {sectionName,sectionId,courseId } = req.body;
        //data validation
        if(!sectionName || !sectionId ){
            return res.status(400).json({
                success:false,
                msg:"Missing Properties."
            })
        };
        //data updation
        const section = await Section.findByIdAndUpdate(sectionId,
            {
                sectionName
            },
            {new:true}
        )
        // const course = await Course.findById("course----",courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec()

        console.log(section);
        //return response
        return res.status(200).json({
            success: true,
            message:"Section Updated Successfully."
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Error in Section Updation.",
        })
    }
};


exports.deleteSection = async (req,res)=>{
    try{
        //get ID  --- assuming that we are sending ID in params..
        // const {sectionId} = req.params;
        const { sectionId, courseId } = req.body || req.params ;

        //use findbyid and delete..
        const deleteSection = await Section.findByIdAndDelete(sectionId);


        //TODO : de we need to delete the entry from the course Schema...??
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
              courseContent: sectionId,
            },
        })

        //return response..
        return res.status(200).json({
            success: true,
            message:"Section Deleted Successfully."
        })
         
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Error in Section Deletion.",
        })
    }
}