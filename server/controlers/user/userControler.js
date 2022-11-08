const asyncHandler = require("express-async-handler")
const userModel = require("../../models/user")


const userRegister = asyncHandler(
    async (req, res) => {
            const { firstName, lastName, password, email} = req.body
            const oldUser = await userModel.findOne({ email })
        if (oldUser) {
            throw new Error("user allready exist")
        }
         
            const user = await userModel.create({
                firstName, lastName, password, email
            })
            res.status(201).json(user)
        
    }
)

const userLogin = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    console.log(userModel.isPasswordMatch)
    console.log(email)
    const userFound = await userModel.findOne({ email })
    console.log(userFound)
    if (userFound && await userFound.isPasswordMatch(password)) {
        res.json({
            message: "user logged in successful"
        })
    } else {
        res.status(401)
        throw new Error("invalid login credentials")
    }
       
    
})


module.exports = {
    userRegister, userLogin
}