const { DataTypes } = require('sequelize')
const sequelize = require("../db/index")

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING
    // allowNull: false
  }
}, 
{
  timestamps: false,
  tableName: 'users',
  schema: 'project'
})

module.exports = User