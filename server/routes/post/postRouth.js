const express = require("express")
const { postComment, fetchAllPost } = require("../../controlers/post/postCTR")
const checkIfUserLoggedIn = require("../../middleware/checkIfUserLoggedIn")
const { imageUploadHandler, reducePostImageSize } = require("../../middleware/imageUploadHandler")

const postRouth = express.Router()

postRouth.post("/",checkIfUserLoggedIn,imageUploadHandler.single("image"), reducePostImageSize, postComment)

postRouth.get("/all",checkIfUserLoggedIn, fetchAllPost)

module.exports= {
    postRouth
}