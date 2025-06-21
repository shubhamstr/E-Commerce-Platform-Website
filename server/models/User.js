/* eslint-disable @typescript-eslint/no-require-imports */
// models/User.js
const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db")

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
})

module.exports = User
