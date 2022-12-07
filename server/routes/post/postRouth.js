const express = require("express")
const { postComment } = require("../../controlers/post/postCTR")
const checkIfUserLoggedIn = require("../../middleware/checkIfUserLoggedIn")

const postRouth = express.Router()

postRouth.post("/",checkIfUserLoggedIn, postComment)

module.exports= {
    postRouth
}