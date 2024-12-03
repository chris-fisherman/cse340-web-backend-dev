// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// My account route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Register route
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;