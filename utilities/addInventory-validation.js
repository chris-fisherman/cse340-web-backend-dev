/* ****************************************
*  REQUIRE STATEMENTS
* *************************************** */
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  INVENTORY Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        // Classification is required and must be string
        body("classification_id")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min: 1 })
          .withMessage("Please provide a classification name."), // on error this message is sent.
    
        // Make is required and must be string
        body("inv_make")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min: 3 })
          .withMessage("Please provide a inventory make."), // on error this message is sent.

        // Model is required and must be string
        body("inv_model")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min: 3 })
          .withMessage("Please provide a inventory model."), // on error this message is sent.

        // Description is required and must be string
        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a description."), // on error this message is sent.

        // Image is required and must be string
        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a image path."), // on error this message is sent.

        // Thumbnail is required and must be string
        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a thumbnail path."), // on error this message is sent.

        // Price is required and must be string
        body("inv_price")
        .isNumeric()
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a price."), // on error this message is sent.

        // Year is required and must be string
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 4, max: 4 })
        .withMessage("Year must be a 4-digit number."), // on error this message is sent.

        // Miles is required and must be string
        body("inv_miles")
        .isNumeric()
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide the miles."), // on error this message is sent.

        // Color is required and must be string
        body("inv_color")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a color."), // on error this message is sent.

      ]
}

/* **************************************
 * Checking inv data
 ************************************* */
validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_price, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, } = req.body;
  
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let selectList = await utilities.buildClassificationList();
  
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        selectList,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_miles,
        inv_color,
      });
      return;
    }
    next();
  };

/* **************************************
 * Checking EDIT INVENTORY data
 ************************************* */
validate.checkUpdateData = async (req, res, next) => {
  const { classification_id, inv_id, inv_make, inv_model, inv_year, inv_price, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, } = req.body;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let selectList = await utilities.buildClassificationList();

    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + inv_model,
      nav,
      selectList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate