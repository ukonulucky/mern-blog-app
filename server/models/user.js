const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    profilePhoto: {
        type: String,
        default: "https://www.shutterstock.com/image-vector/avater-thin-line-vector-icon-600w-2183087083.jpg"
    },
    email:{
        type: String,
        required:[true, "Email field is required"]
    },
    bio: {
        type: String, 
    },
    password: {
        type: String,
        required:[true, "Password is required"]
    },
    postCount:{
        type: Number,
         default: 0
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default:false
    },
    
    role: {
        type: String,
        Enum:["Admin","Guest", "Blogger"]
    }, 
    isFollowing: {
        type: Boolean,
        default: false
    },
    isUnFollowing: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewedBy: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    followers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
         }
     ]
    },
    following: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
         }
     ]
    },
    unFollowing: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active:{
        type: Boolean,
        default: false
    }
    },
    {
        toJSON: {
            virtual: true
        },
        toObject: {
            virtual: true
        },
        timestamp: true
    })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()

})

userSchema.methods.isPasswordMatch = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}
const userModel = mongoose.model("User", userSchema)

module.exports = userModel