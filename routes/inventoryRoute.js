// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require('../utilities/newClassification-validation')
const inventoryValidate = require('../utilities/addInventory-validation')

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManageInv));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build car detail
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailsByInvId));

// Add classification route
router.get("/new-class", utilities.handleErrors(invController.buildAddClassification));
// post
router.post(
    "/new-class",
    classificationValidate.classificationRules(),
    classificationValidate.checkClassData,
    utilities.handleErrors(invController.registerNewClassification)
);

// Add inventory route
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
// post
router.post(
    "/add-inventory",
    inventoryValidate.inventoryRules(),
    inventoryValidate.checkInvData,
    utilities.handleErrors(invController.registerNewInventory)
);

module.exports = router;