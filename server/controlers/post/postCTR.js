const expressAsyncHandler = require("express-async-handler")
const { PostModel } = require("../../models/PostSchema")
const profaneWords = require("bad-words")
const userModel = require("../../models/user")


const postComment = expressAsyncHandler(async (req, res) =>{
  const profaneWordsInstance = new profaneWords()
  const filterProfaneWords = profaneWordsInstance.isProfane(req.body.title, req.body.description)
  console.log(filterProfaneWords)
  if(filterProfaneWords){
  const {_id}= req.user
    await userModel.findByIdAndUpdate(_id, {
      isBlocked: true
    }, {
      new: true
    })
   throw new Error("Posting failed becaused it contains some profane words and you have been blocked")
  }
  try {
 
   const newPost = await PostModel.create({
    ...req.body, user:req.user._id
   })
   res.send(newPost)
  } catch (error) {
    throw new Error(error.message)
  }
})


module.exports= {
  postComment
}