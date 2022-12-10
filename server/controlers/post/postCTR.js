const expressAsyncHandler = require("express-async-handler")
const { PostModel } = require("../../models/PostSchema")
const path = require("path")
const fs = require("fs")
const profaneWords = require("bad-words")
const userModel = require("../../models/user")
const cloudinaryUploadImage = require("../../utils/cloudinary")
const validateId = require("../../utils/validateId")


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
   const updatedPost = await PostModel.create({
    ...req.body, user:req.user?._id, image: JSON.stringify(imageData)
   })
   res.send(updatedPost) 
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
// this controler will be used to monitor the number of views on partcular post
const fetchSinglePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const userPost = await PostModel.findByIdAndUpdate(id, {
      $inc: {  numViews: +1 }},
      {
        new: true
      })
      if(userPost){
         res.status(200).json({
          userPost
        })
      
      } else{
        res.status(404).json({
          message: "Post not found"
        })
      }
    
  } catch (error) {
    throw new Error(error.message)
  }
})

// this controler will be used to update post
// SERP

const updatePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params
  validateId(id)
 console.log()
  try {
    if(Object.keys(req.body).length === 0) {
      console.log("hello")
      throw new Error("Invalid Post details")
     
    }
    const updatedPost = await PostModel.findByIdAndUpdate(id, {
      ...req.body, user: req.user._id
    }, {
      new: true
    })
    if (updatedPost) {
      res.status(200).json({
        message: "Post updated successfully",
        post: updatedPost
    })
  } else {
    res.status(404).json({
          message: "Post not found"
        })
  }
}
  catch (error) {
    throw new Error(error.message)
  }})


  const deletePost = expressAsyncHandler(async (req, res) => {
    const { id } = req.params
    validateId(id)
    try {
      const post = await PostModel.findByIdAndDelete(id)
      if (post) {
        res.status(200).json({
          message: "Post deleted successfully",
          post: post
        })} else{
          res.status(404).json({
            message: "Post not found"
          })
        }
  } catch(error){
   throw new Error(error.message)
  }
})

module.exports= {
  postComment, fetchAllPost, fetchSinglePost, updatePost, deletePost
}