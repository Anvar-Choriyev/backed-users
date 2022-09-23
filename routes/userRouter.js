const express = require("express")
const userController = require("../controllers/userController")

const router = express.Router()

router
    .route("/")
        .get(userController.getUsers)
        .post(userController.createUser)
router
    .route("/:id")
        .get(userController.getById)
        .delete(userController.deleteUser)            
router
    .route("/:id/status")
        .patch(userController.updateStatus)    
module.exports = router