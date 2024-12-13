/* ************************
 * REQUIRE STATEMENTS
 ************************** */
const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = '<ul id="navList">'
    list += '<li class="navItems"><a class="navLinks" href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += '<li class="navItems">'
        list +=
            '<a class="navLinks" href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li class="invItems">'
            grid +=  '<a class="invImgContainer" href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + vehicle.inv_model 
            + ' Details"><img class="invImg" src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr class="invLine">'
            grid += '<h2>'
            grid += '<a class="invNameLink" href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<p class="invPrice">$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data){
    let grid
    if(data){
        
        grid = '<section id="detailContainer">'
        
            grid += '<img class="detImg" src="' + data.inv_image 
            +'" alt="Image of '+ data.inv_make + ' ' + data.inv_model 
            +' on CSE Motors">'

            grid += '<div class="namePriceDescription">'
                grid += `<h2><b>${data.inv_make} ${data.inv_model} Details</b></h2>`

                grid += '<div class="detailsContainer2">'
                    grid += '<p class="detPrice"><b>Price: $' 
                    + new Intl.NumberFormat('en-US').format(data.inv_price) + '</b></p>'
                    grid += `<p class="detDesc"><b>Description</b>: ${data.inv_description}</p>`
                    grid += `<p class="detColor"><b>Color</b>: ${data.inv_color}</p>`
                    grid += `<p class="detMiles"><b>Miles</b>: ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>`
                grid += '</div>'
            grid += '</div>'
        
        grid += '</section>'
    } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList = '<label for="classification_id" id="classificationList">Classification:</label><br>'
    classificationList +=
      '<select name="classification_id" id="classification_id" class="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    res.locals.loggedin = 0
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
        })
    } else {
        res.locals.loggedin = 0
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

module.exports = Util