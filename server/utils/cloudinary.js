const cloudinary = require("cloudinary").v2



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
        folder:"Registered users"
    })
    return data;
  } catch (error) {
    return error
  }

}

module.exports = cloudinaryUploadImage