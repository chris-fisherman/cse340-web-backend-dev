/* ****************************************
*  REQUIRE STATEMENTS
* *************************************** */
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  CLASSIFICATION Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .isAlpha()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
      return
    }
    next()
}

module.exports = validate