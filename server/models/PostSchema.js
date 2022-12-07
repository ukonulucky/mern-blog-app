const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim : true,
    },
    categories: {
        type: String, 
        required: [true, "Post category is required"],
        default: "All"
    },
    isLiked:{
        type: Boolean,
        default: false,
    },
    isDisLiked:{
        type: Boolean,
        default: false,
    },
    numViews: {
        type: Number,
        default: 0
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    disLikes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    user:{
        
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:["true", "Please Author is required"]
    },
    description: {
        type:String, 
        required: [true,"Please Description is required"]
    },
    image:{
   type: String,
    default:"https://cdn.pixabay.com/photo/2022/11/28/20/09/blue-tit-7623100__340.jpg"
    }
},{
    toObject:{
        virtuals: true,
    },
    toJSON:{
        virtuals: true,
    },
    timestamps:true
})


const PostModel = mongoose.model("PostModel", postSchema)

module.exports={
    PostModel
}