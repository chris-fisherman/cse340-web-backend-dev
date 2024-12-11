const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build Management Inventory
 * ************************** */
invCont.buildManageInv = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
        errors: null,
    })
}

/* ***************************
 *  Build Add Classification
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process New Clasification
* *************************************** */
invCont.registerNewClassification = async function (req, res, next) {
    const { classification_name } = req.body
    
    const newClassResult = await invModel.insertClassification(
        classification_name
    )
  
    if (newClassResult) {
      req.flash(
        "notice",
        `Congratulations! The ${classification_name} classification was successfully added.`
      )
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the adition failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
      })
    }
  }

/* ****************************************
*  Process New Inventory
* *************************************** */
invCont.registerNewInventory = async function (req, res, next) {
  const { inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id } = req.body
  
  const newInvResult = await invModel.insertInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (newInvResult) {
    req.flash(
      "notice",
      `Congratulations! The new inventory was successfully added.`
    )
    return res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the adition failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      selectList,
    })
  }
}

/* ***************************
 *  Build Add Inventory
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let selectList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      selectList,
      errors: null,
  })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build details by inventory id
 * ************************** */
invCont.buildDetailsByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    const grid = await utilities.buildDetailGrid(data)
    let nav = await utilities.getNav()
    const className = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
    res.render("./inventory/details", {
        title: className,
        nav,
        grid,
    })
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont