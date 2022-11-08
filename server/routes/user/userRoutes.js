const express = require("express")
const { userRegister, userLogin } = require("../../controlers/user/userControler")

const userRouter = express()


userRouter.post("/register", userRegister)

userRouter.post("/login", userLogin)


module.exports = userRouter