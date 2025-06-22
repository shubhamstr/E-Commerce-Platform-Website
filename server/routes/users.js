/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const User = require("../models/User")
const sendResponse = require("../utils/response")

/* POST user registering. */
router.post("/", async function (req, res, next) {
  try {
    console.log(req.body)
    const { firstName, lastName, email, password } = req.body
    const userResp = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    })
    console.log("User registered:", userResp.toJSON())
    sendResponse(res, {
      message: "User registered successfully.",
      data: userResp,
    })
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error,
      },
      500
    )
  }
})

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router
