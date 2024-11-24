const invModel = require("../models/inventory-model")
const Util = {}

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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util