const Category = require("../models/Category")



exports.createCategory = async (req,res)=>{
    try{
        //fetch the data
        const {name,description} = req.body;

        //validation
        if( !name || !description){
            return res.status(400).json({
                success: false,
                msg:"Please enter all fields"
            });
        }

        const categoryDetails = await Category.create({
            name:name,
            description:description,
        })
        console.log(categoryDetails);

        //return response
        res.status(200).json({
            success: true,
            message:"Category Created Successfully."
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};


//showAllCategorys handler function
exports.showAllCategories = async (req,res)=>{
    try{
        const allCategory=await Category.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message:"All Category returned Successfully.",
            allCategory
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};


//categoryPageDetails
exports.categoryPageDetails = async(req,res)=>{
    try{
        //get CategoryId
        const {categoryId} = req.body;

        //get courses for specified category 
        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
          }).exec();

        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "No Data Found"
            });
        }

        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
            })
        }

        //get courses for different category
        const differentCategory = await Category.findById({_id:{$ne:categoryId}}).populate("courses").exec();

        // Get top-selling courses across all categories
        const allCategories = await Category.find()
        .populate({
        path: "courses",
        match: { status: "Published" },
        })
        .exec()
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)


        //return response
        return res.status(200).json({
            success : true ,
            data:{
                selectedCategory,
                differentCategory
            }
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            succes: false,
            error: error.message
        })
    }
}