const AppError = require("../utils/appError")

const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}
const sendErrorProd = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        errors: err.errors,
        message: err.message
    })
}

const errorController = (err, req, res, next) => {
    console.log(err.stack);
    console.log(err);

    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if(process.env.NODE_ENV === "dev") {
        sendErrorDev(res, err)
    } else if(process.env.NODE_ENV === "prod") {
        if(err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        } else {
            let error = Object.create(err)
            if(error.name === "SequelizeDatabaseError") {
                if(err.original.code === "22P02") {
                    error = new AppError("Cast error", 400)
                }
            }
            if(error.name === "SequelizeUniqueConstraintError") {
                if(err.original.code === "23505") {
                    error = new AppError("The row already exists", 409)
                }
            }
            if(error.name === "ValidationError") {
                error.errors = error.errors.map(e=>e.msg)
            }
            if(error.name === "TokenExpiredError") {
                error = new AppError("Your token's date is expired", 401)
            }
            sendErrorProd(error, res)
        }
    }

}

module.exports = errorController