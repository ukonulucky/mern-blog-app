const asyncHandler = require("express-async-handler")
const { generateToken } = require("../../config/token/generateToke")
const { validate } = require("../../models/user")
const path= require("path")
const fs =  require("fs")

const userModel = require("../../models/user")
const cloudinaryUploadImage = require("../../utils/cloudinary")
const validateId = require("../../utils/validateId")
const { PostModel } = require("../../models/PostSchema")


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
        const token = generateToken(userFound._id)
        if (token) {
            res.cookie("loginToken", token, {
                maxAge: 24 * 60 * 60 * 1000
            })
        } else {
            res.statusCode = 500
            throw new Error("user login failded")
        }
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
    const { user } = req
    try {
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

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateId(_id)
    const { firstName, lastName, email } = req.body
    if (_id) {
        const user = await userModel.findByIdAndUpdate(_id, {
              firstName, lastName, email
        }, {
            new: true,
            runValidators : true
        })
        if (!user) {
            throw new Error("user not found")
        }
        res.json(user)
      }
})

const updatePassword = asyncHandler(async (req, res) => {
    const { password, email } = req.body
    console.log(email, password)
    if (!password || !email) {
        throw new Error("password and email field must be filed")
    }
    const user = await userModel.findOne({ email })
    if (user) {
        user.password = password || user.password
        user.email = user.email
        user.lastName = user.lastName
        user.firstName = user.firstName
        const updatedUser = await user.save()
        if (!updateUser) {
            throw new Error("user failed to update")
        }
        res.json(updatedUser)

    }
    else {
        throw new Error("user not found")
    }


})

const followUser = asyncHandler(async (req, res) => {
    // destruction the id of the user we wish to follow from body
    const { userToFollowId } = req.body
    const { _id } = req.user
    validateId(_id)
    console.log(_id,userToFollowId)

    if (!userToFollowId || !_id) {
        throw new Error("cant follow user")
    }
    // check if user is already following
    
        const checkIfFollowing = req.user.following.find(i => i.toString() === userToFollowId.toString())
    if (checkIfFollowing) {
        res.json("user allready following")
        return 
    }
    
    // adding users to follow array of loggedInUser
    const logedInUser = await userModel.findByIdAndUpdate(_id, {
        $push: { following: userToFollowId },
        isFollowing: true
    }, {
        new: true,
        runValidators: true
    })

    // adding the loggedInUser to the followers array of the userToFollow
    const userToFollowArray = await userModel.findByIdAndUpdate(userToFollowId, {
        $push: {
            followers: _id
        }
       
    }, {
        new: true,
        runValidators: true   
    })
   


    if (!userToFollowArray) {
        res.statusCode = 500
        throw new Error("cant follow user")
    }
    res.json({
        message: "user following successful"
    })

})

const unFollow = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { userIdToUnFollowId } = req.body
    
    if (!_id || !userIdToUnFollowId) throw new Error("user to be unfollowes does not exist")
    // finds user following by index and remove the logedInUser index from the follower array
    const userFollowing = await userModel.findByIdAndUpdate(userIdToUnFollowId, {
        $pull: {
            followers: _id
        },
        isUnFollowing: true
    }, {
        new: true
    })


    // finds user following by index and remove the logedInUser index from the follower array
    
    const userLoggedIn = await userModel.findByIdAndUpdate(_id, {
        $pull: {
            following: userIdToUnFollowId
        },
        isFollowing: false
    }, {
        new: true
    })
   
    res.json({message: `user ${userFollowing.firstName} ${userFollowing.lastName} successfully unfollowed`})
    

})

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateId(id)
    const user = await userModel.findByIdAndUpdate(id, {
        isBlocked: true
    }, {
        new : true
    })
    if (!user) {
        throw new Error("user not found and failed to unblock the user")
    }
    res.json({
        message: "user blocked succcessfully",
        data: user
    })
})

const unBlockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateId(id)
    const user = await userModel.findByIdAndUpdate(id, {
        isBlocked: false
    }, {
        new: true
    })
    if (!user) {
        throw new Error("user not found and failed to unblock the user")
    }
    res.json({
        message: "user ubcloked successfully",
        data: user
    })
})

const loggedUser = asyncHandler(async (req, res) => {
    
})

const profilePhotoUpload = asyncHandler(async (req, res, next) => {
   
 try {
    const localPath = path.join(`public/profile-images-uploads/${req.file.fileName}`)
    const data = await cloudinaryUploadImage(localPath,"registerdUserImage")
   if(data){
    const {public_id, secure_url} = data;
    const imageData = {public_id, secure_url} 
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        profilePhoto: JSON.stringify(imageData)
       
    },{
        new: true
    })
if(user){
    fs.unlinked(localPath, (err) => {
          if(err){
            console.log("image not deleted", err)
            return
          }
          console.log("image successfully deleted")

    })
    res.json({
        message: "profile photo uploaded successfully",
        data: user
})

   }else{
        const error = new Error("user not found and failed to upload profile photo")
   next(error)
    } }
} catch (error) {
  res.json(error.message)
}
})

const fetchUserProfile = asyncHandler(async (req, res,next) => {
    const {id}= req.params
    validateId(id)
    try {
      
      const user = await userModel.findById(id).populate("allUserPost")
     user ? res.status(200).json(user) : null
     
    } catch (error) {
    throw new Error(error.message)
    }
  })


module.exports = {
    userRegister, userLogin, fetchAllUsers, fetchUser, deleteUser, updateUser,
    updatePassword, followUser, unFollow, blockUser, unBlockUser, profilePhotoUpload, fetchUserProfile
}
