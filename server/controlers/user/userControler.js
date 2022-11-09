const asyncHandler = require("express-async-handler")
const { generateToken } = require("../../config/token/generateToke")

const userModel = require("../../models/user")
const validateId = require("../../utils/validateId")


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
    const userFound = await userModel.findOne({ email })
 
    if (userFound && await userFound.isPasswordMatch(password)) {
        
        res.json({
            message: "user logged in successful",
            token: generateToken(userFound._id)
        })
    } else {
        res.status(401)
        throw new Error("invalid login credentials")
    }
       
    
})

const fetchAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await userModel.find({})
            res.json(users)
    } catch (error) {
        res.json(error.message)
    }
})

const fetchUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    console.log(id)
    validateId(id) 
    try {
        const user = await userModel.findOne({ _id:id })
        if (user) {
            res.json(user)
        } else {
            res.status(401)
            res.json({
                message: "user not found"
            })
       }

    } catch (error) {
      res.json(error.message)

    }

})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateId(id)
    try { const user = await userModel.findOneAndDelete({_id:id})
        res.json(user)
    } catch (error) {
        res.json(error.message)
        
    }

})

module.exports = {
    userRegister, userLogin, fetchAllUsers, fetchUser, deleteUser
}