const { DataTypes } = require('sequelize')
const sequelize = require("../db/index")
// const Post = require("./post.model")

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
  }
}, 
{
  timestamps: true,
  tableName: 'users',
  schema: 'project'
})

// User.hasMany(Post,{foreignKey: 'userId'})

module.exports = User

