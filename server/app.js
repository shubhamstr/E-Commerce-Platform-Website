/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var cors = require("cors")

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")

var app = express()

app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/user", usersRouter)

module.exports = app
