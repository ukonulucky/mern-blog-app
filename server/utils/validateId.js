const mongoose = require("mongoose")


const validateId = (_id) => {
    const isValid = mongoose.Types.ObjectId.isValid(_id)
    if(!isValid) throw new Error("invalid user id")
}

module.exports = validateId