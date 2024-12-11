// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Register route
// get
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// post
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Login process
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
)

// Account route
router.get("/", utilities.handleErrors(accountController.buildManagement));

module.exports = router;