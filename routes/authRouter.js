const express = require("express")
const authController = require("../controllers/authController")
const {body} = require("express-validator")

const router = express.Router()

router
    .post("/register",
    body("name")
    .notEmpty()
    .withMessage("Name mustn't be empty"),
    body("email")
    .notEmpty()
    .withMessage("Email mustn't be empty"),
    body("password")
    .notEmpty()
    .withMessage("Password mustn't be empty"),
    authController.register
    )
router
    .post("/login",
    body("email")
    .notEmpty()
    .withMessage("Email mustn't be empty"),
    body("password")
    .notEmpty()
    .withMessage("Password mustn't be empty"),
    authController.login
    )
    
module.exports = router