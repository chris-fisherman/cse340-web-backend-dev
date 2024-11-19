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

module.exports = Util