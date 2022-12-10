const express = require("express")
const { postComment, fetchAllPost, fetchSinglePost, updatePost, deletePost, toggleAndLikePost, toggleAndDislikePost } = require("../../controlers/post/postCTR")
const { fetchUserProfile } = require("../../controlers/user/userControler")
const checkIfUserLoggedIn = require("../../middleware/checkIfUserLoggedIn")
const { imageUploadHandler, reducePostImageSize } = require("../../middleware/imageUploadHandler")

const postRouth = express.Router()

postRouth.post("/",checkIfUserLoggedIn,imageUploadHandler.single("image"), reducePostImageSize, postComment)

postRouth.get("/all",checkIfUserLoggedIn, fetchAllPost)

postRouth.get("/userProfile",checkIfUserLoggedIn)

postRouth.get("/singlePost/:id",checkIfUserLoggedIn, fetchSinglePost)

postRouth.put("/updatePost/:id",checkIfUserLoggedIn, updatePost)

postRouth.put("/like",checkIfUserLoggedIn, toggleAndLikePost)

postRouth.put("/dislike",checkIfUserLoggedIn, toggleAndDislikePost)

postRouth.delete("/deletePost/:id",checkIfUserLoggedIn, deletePost)

module.exports= {
    postRouth
}