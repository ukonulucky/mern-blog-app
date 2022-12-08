const expressAsyncHandler = require("express-async-handler")
const { PostModel } = require("../../models/PostSchema")
const path = require("path")
const fs = require("fs")
const profaneWords = require("bad-words")
const userModel = require("../../models/user")
const cloudinaryUploadImage = require("../../utils/cloudinary")


const postComment = expressAsyncHandler(async (req, res) =>{
  const profaneWordsInstance = new profaneWords()
  const filterProfaneWordsTitle = profaneWordsInstance.isProfane( req.body.title)
  const filterProfaneWordsDescription = profaneWordsInstance.isProfane( req.body.description)

  if(filterProfaneWordsTitle || filterProfaneWordsDescription){
  const {_id}= req.user
    await userModel.findByIdAndUpdate(_id, {
      isBlocked: true
    }, {
      new: true
    })
   throw new Error("Posting failed becaused it contains some profane words and you have been blocked")
  }
  const localPath = path.join(`public/post/${req.file.fileName}`)
  const data = await cloudinaryUploadImage(localPath,"blogUploadImage")
  const {public_id, secure_url} = data;
  const imageData = {public_id, secure_url} 
   fs.unlink(localPath, (err,file) => {
   if(err){
    console.log(err)
   }
     console.log("image deleted successfully")
  })
  try {
   const newPost = await PostModel.create({
    ...req.body, user:req.user?._id, image: JSON.stringify(imageData)
   })
   res.send(newPost) 
  } catch (error) {
    throw new Error(error.message)
  }
}) 

const fetchAllPost = expressAsyncHandler(async (req, res) => {
 try {
  const posts = await PostModel.find({}).populate("user")
  res.send(posts)
 } catch (error) {
  throw new Error(error.message)
 }
})

// SERP
module.exports= {
  postComment, fetchAllPost
}