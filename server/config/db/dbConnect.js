const mongoose = require("mongoose")

const dbConnect = async () => {
  try {
      const res = await mongoose.connect(process.env.MONGU_URL)
      return res
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = dbConnect