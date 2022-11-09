const express = require("express")
const { userRegister, userLogin, fetchAllUsers, fetchUser, deleteUser } = require("../../controlers/user/userControler")

const userRouter = express()


userRouter.post("/register", userRegister)

userRouter.post("/login", userLogin)

userRouter.get("/", fetchAllUsers)

userRouter.get("/:id", fetchUser)

userRouter.delete("/:id", deleteUser)

module.exports = userRouter