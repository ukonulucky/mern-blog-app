require("dotenv").config()
const express = require("express")
const dbConnect = require("./config/db/dbConnect")
const {errorHandler, noteFoundError} = require("./middleware/error")
const userRouter = require("./routes/user/userRoutes")


const app = express()
app.use(express.json())
app.use("/api/user", userRouter)
// Middleware Creation 
app.use(noteFoundError)
app.use(errorHandler)
// creating server
 const Port = process.env.PORT || 5000



const serverConnect = async () => {
  try {
      const res = await dbConnect()
      if (res) {
          app.listen(Port, () => {
              console.log(`db connected and server running on port ${Port}`)
          })
      }
  } catch (error) {
    console.log(error.message)
  }
}

serverConnect()