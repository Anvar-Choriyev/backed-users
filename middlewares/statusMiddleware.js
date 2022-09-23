const AppError = require("../utils/appError")

module.exports = (req, res, next) => {
    const user = req.user
    if(!user) {
        return next(new AppError("Unauthorized", 401))
    }
    if(user.status !== "ACTIVE") {
        return next(new AppError("This user is blocked"), 401)
    }
    next();
}