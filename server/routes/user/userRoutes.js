const express = require("express")
const { userRegister, userLogin, fetchAllUsers, fetchUser, deleteUser, updateUser, updatePassword, followUser, unFollow, blockUser, unBlockUser } = require("../../controlers/user/userControler")
const checkIfUserLoggedIn = require("../../middleware/checkIfUserLoggedIn")

const userRouter = express()


userRouter.post("/register", userRegister)

userRouter.post("/login", userLogin)

userRouter.get("/", checkIfUserLoggedIn, fetchAllUsers)

userRouter.get("/:id", checkIfUserLoggedIn, fetchUser)

userRouter.delete("/:id", checkIfUserLoggedIn, deleteUser)
userRouter.put("/updateuser", checkIfUserLoggedIn, updateUser)
userRouter.put("/updatepassword", updatePassword)
userRouter.put("/follow", checkIfUserLoggedIn, followUser)
userRouter.put("/unfollow", checkIfUserLoggedIn, unFollow)
userRouter.put("/block-user/:id", checkIfUserLoggedIn, blockUser)
userRouter.put("/unblock-user/:id",checkIfUserLoggedIn,unBlockUser)

module.exports = userRouter