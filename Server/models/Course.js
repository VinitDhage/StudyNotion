const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    
    courseName:{
        type: String,
    },
    courseDescription:{
        type: String,
    },
    instructor:{
        type : mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
            type : mongoose.Schema.Types.ObjectId, 
            ref:"Section"
        }
    ],
    ratingAndReviews:[
        {
            type : mongoose.Schema.Types.ObjectId, 
            ref:"RatingAndReviews"
        }
    ],
    price:{
        type: String,
    },
    thumbnail:{
        type: String,
    },
    tag:{
        // type:[String],
        type:String,
        required:true,
    },
    category:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentsEnrolled:[
        {
            type : mongoose.Schema.Types.ObjectId,
            required:true, 
            ref:"User"
        }
    ],
    instructions:{
        // type: [String],
        type:String
    },
    status:{
        type: String,
        enum:["Draft","Published"],
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }

});


module.exports = mongoose.model('Course',courseSchema);