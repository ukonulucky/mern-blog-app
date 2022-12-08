const sharp = require("sharp")
const multer = require("multer")
const path = require("path")
// creating a temperare storage for images
const memoryStorage = multer.memoryStorage()


const multerFilter = (req, file, cb) => {

    // cheking for iamge fromat
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype!== "image/jpeg") {
        return cb({
            message: "unsurpoted image format"
        }, false)
    } else{
        return cb(null, true)
    }

}


const imageUploadHandler  =  multer({
    storage: memoryStorage,
    fileFilter: multerFilter,
    limits: {
        // limiting file sizes to 1mege bytes
        fileSize: 1000000
    }
})

const reduceImageSize =async (req, res, next) => {
try {
    if(!req.file) {
        return res.status(400).json({
            message: "no file uploaded"
        })
        return next()
    }
 req.file.fileName = `user-${Date.now()}-${req.file.originalname}`
  await sharp(req.file.buffer)
  .resize(250, 250)
  .toFormat("jpeg")
  .jpeg({
    quality: 90
  }).toFile(path.join(`public/profile-images-uploads/${req.file.fileName}`),(err,data) => {
   if(err){
   res.json({
    message: "error occured while uploading image"
   })
   return
   }
   next()
  })
 
} catch (error) {
    console.log(error)
}

}


const reducePostImageSize =async (req, res, next) => {
    try {
        if(!req.file) {
            return res.status(400).json({
                message: "no file uploaded"
            })
            return next()
        }
     req.file.fileName = `user-${Date.now()}-${req.file.originalname}`
      await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({
        quality: 90
      }).toFile(path.join(`public/post/${req.file.fileName}`),(err,data) => {
       if(err){
       res.json({
        message: "error occured while uploading image"
       })
       return
       }
       next()
      })
     
    } catch (error) {
        console.log(error)
    }
    
    }
    
module.exports = {
    imageUploadHandler, reduceImageSize, reducePostImageSize
}