const express = require("express")
const cors = require("cors")
const AppError = require("./utils/appError")
const userRouter = require("./routes/userRouter")
const authRouter = require("./routes/authRouter")
const errorController = require("./controllers/errorController")
const authMiddleware = require("./middlewares/authMiddleware")
const statusMiddleware = require("./middlewares/statusMiddleware")

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/v1/users", 
authMiddleware, 
statusMiddleware, 
userRouter)
app.use("/api/v1/auth", authRouter)

app.all("*", (req, res, next) => {
    next(new AppError(`${req.path} not exist`, 404))
})
app.use(errorController)
module.exports = app