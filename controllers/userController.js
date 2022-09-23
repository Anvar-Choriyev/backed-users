const Users = require("../models/Users");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const statusType = require("../utils/statusENUM")

exports.getUsers = catchAsync(async (req, res, next) => {
    const allUsers = await Users.findAndCountAll()
    if(!allUsers) {
        return next(new AppError("Users list is empty", 404))
    }
    res.json({
        status: "success",
        message: "get Users",
        error: null,
        data: {
            allUsers
        }
    })
})
exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await Users.create(req.body)
    if(!newUser) {
        return next(new AppError("New user not found", 404))
    }
    res.json({
        status: "success",
        message: "User created",
        error: null,
        data: {
            newUser
        }
    })
})
exports.getById = catchAsync(async (req, res, next) => {
    const {id} = req.params
    const userById = await Users.findByPk(id)
    if(!userById) {
        return next(new AppError(`Users with this id ${id} is not defined`))
    }
    res.status(201).json({
        status: "success",
        message: "User found by id",
        error: null, 
        data: {
            userById
        }
    })
})
exports.deleteUser = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const userById = await Users.findByPk(id)
    if(!userById) {
        return next(new AppError(`Users with this id ${id} is not defined`))
    }
    userById.destroy()
    res.json({
        status: "success",
        message: "User deleted",
        error: null,
        data: null
    })
})
exports.updateStatus = catchAsync(async(req, res, next) => {
    const {id} = req.params
    const {status} =req.body
    const userById = await Users.findByPk(id)
    await userById.update({status })
    res.json({
        status: "success",
        message: "User's status changed",
        error: null,
        data: {
            userById
        }
    })
})