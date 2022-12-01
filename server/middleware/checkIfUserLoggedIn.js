const jwt = require("jsonwebtoken")
const userModel = require("../models/user")
const asyncHandler = require("express-async-handler")


const checkIfUserLoggedIn = asyncHandler(async (req, res, next) => {
    const { loginToken } = req.cookies
  
    if (loginToken) {

        jwt.verify(loginToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                res.json("user not logged in")
                return
                
            }
            const { id } = decoded
            if (id) {
                const user = await userModel.findOne({ _id: id })
                if (!user) {
                    res.json("user does not exist") 
                    return
                }
             req.user = user
             next() 
            }
        }) 
    } else {
        throw new Error("user not logged in")
    }
}
)

module.exports = checkIfUserLoggedIn