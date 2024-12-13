/* ****************************************
*  REQUIRE STATEMENTS
* *************************************** */
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Management view delivering
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()

  const accountData = res.locals.accountData

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Management view delivering
* *************************************** */
async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav()

  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    accountData,
  })
}

/* ****************************************
*  UPDATE ACCOUNT DATA Process
* *************************************** */
async function updateAccountData(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const accountData = await accountModel.getAccountById(account_id)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      accountData,
      account_id: accountData.account_id,
    })
    return
  }

  const updateResult = await accountModel.updateAccount(
    account_firstname.account_firstname,
    account_lastname.account_lastname,
    account_email.account_email,
    account_id.account_id,
  )

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re information have been updated.`
    )
    const updatedAccountData = await accountModel.getAccountById(account_id);
      // Update res.locals.accountData for rendering the updated page
      res.locals.accountData = updatedAccountData;
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData,
    })
  }
}

/* ****************************************
*  CHANGE PASSWORD Process
* *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  const accountData = await accountModel.getAccountById(account_id)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      accountData,
      account_id,
    })
    return
  }

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error changing the password.')
    res.status(500).render("account/management", {
      title: "Account Management",
      nav,
      accountData,
      errors: null,
    })
  }

  const regResult = await accountModel.changePasswordAccount(
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re have changed your password.`
    )
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      accountData,
    })
  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("account/management", {
      title: "Account Management",
      nav,
      accountData,
    })
  }
}


module.exports = { buildLogin, buildRegister, buildManagement, registerAccount, accountLogin, buildEditAccount, updateAccountData, changePassword }