const Users = require("../models/Users")
const {Op} = require("sequelize")
const catchAsync = require("../utils/catchAsync")
const {validationResult} = require("express-validator")
const AppError = require("../utils/appError")
const jwt = require("jsonwebtoken")
const { compare } = require("bcrypt")

const generateToken = (payload, jwtSecret, options) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, jwtSecret, options, (err, token) => {
            if(err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })
}

const findByEmail = async(email) => {
    const user = await Users.findOne({
        where: {email: {[Op.eq]: email}}
    })
    if(user) {
        return user
    } 
    return null
}
exports.register = catchAsync(async (req, res, next) => {
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        const err = new AppError("Validation error", 400)
        err.isOperational = false
        err.errors = validationErrors.errors
        return next(err)
    }
    const existedUser = await findByEmail(req.body.email)
    if(existedUser) {
        return next(new AppError("User with this email is available", 409))
    }
    const newUser = await Users.create(req.body)
    const payload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    }
    res.status(201).json({
        status: "success",
        message: "Registration completed",
        error: null,
        data: {
            user: {
                ...payload
            }
        }
    }) 
})

exports.login = catchAsync(async (req, res, next) => {
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        const err = new AppError("Validation error", 400)
        err.isOperational = false
        err.errors = validationErrors.errors
        return next(err)
    }
    const {email, password} = req.body
    
    const candidate = await findByEmail(email)
    if(!candidate) {
        return next(new AppError("Login or password is wrong", 400))
    }

    const passwordIsMatch = await compare(password, candidate.password)
    if(!passwordIsMatch) {
        return next(new AppError("Login or password is wrong", 400))
    }

    await candidate.update({lastLoginTime: new Date().toISOString() })
    // candidate.lastLoginTime = new Date().toISOString()
    // await candidate.save()

    const payload = {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        status: candidate.status
    }
    const token = await generateToken(payload, process.env.JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "24d"
    })
    res.status(200).json({
        status: "success",
        message: "You are logged in",
        error: null,
        data: {
            user: {
                ...payload
            },
            jwt: token
        }
    }) 
})