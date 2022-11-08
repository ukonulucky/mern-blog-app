const noteFoundError = (req, res, next) => {
    const newError = new Error(`requested route not found on ${req.originalUrl}`)
    res.statusCode = 404
    next(newError)
}


function errorHandler(error, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode

    const errorMessage = {
        message: error.message,
        stack : process.env.NODE_ENV == "production" ? null  : error.stack
    }
    res.status(statusCode).json(errorMessage)
}




module.exports = {
    errorHandler, noteFoundError
}
