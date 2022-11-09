const jwt = require("jsonwebtoken")

const generateToken = id => {
    console.log(process.env.JWT_SECRET)
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn: "10d"})
}


module.exports = {
    generateToken
}