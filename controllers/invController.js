const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build Management Inventory
 * ************************** */
invCont.buildManageInv = async function (req, res, next) {
    let nav = await utilities.getNav()

    const accountData = res.locals.accountData
    const loggedin = res.locals.loggedin

    const classificationSelect = await utilities.buildClassificationList()
    const classificationTable = await utilities.buildClassificationTable()

    if (loggedin) {
      if (accountData.account_type === "Employee" || accountData.account_type === "Admin") {
        res.render("./inventory/management", {
          title: "Vehicle Management",
          nav,
          classificationSelect,
          classificationTable,
          accountData,
          errors: null,
        })
      }  else { 
        req.flash(
          "notice",
          `You do not have permission to access this section.`
        )
        res.redirect('/account/login/')
      }
    }  else { 
      req.flash(
        "notice",
        `You must be logged to access the inventory management. Please log in.`
      )
      res.redirect('/account/login/')
    }

    // res.render("./inventory/management", {
    //     title: "Vehicle Management",
    //     nav,
    //     classificationSelect,
    //     accountData,
    //     errors: null,
    // })
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

/* ***************************
 *  Edit inventory
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

/* ***************************
 *  Delete inventory VIEW
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Confirm Inventory PROCESS
 * ************************** */
invCont.confirmDeleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", `The deletion was successful.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("inventory/delete-confirm")
  }
}

module.exports = invCont