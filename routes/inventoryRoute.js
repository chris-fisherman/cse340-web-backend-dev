// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManageInv));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build car detail
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailsByInvId));

module.exports = router;