/* REQUIRE STATEMENTS */
const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let formLogin = await utilities.getLogin()
    res.render("account/login", {
      title: "Login",
      nav,
      formLogin,
    })
  }
  
  module.exports = { buildLogin }