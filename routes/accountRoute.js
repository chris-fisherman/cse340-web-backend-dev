// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// My account route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister));

module.exports = router;