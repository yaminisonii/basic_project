const { DataTypes } = require('sequelize')
const sequelize = require("../db/index")

const Post = sequelize.define('Post', {
    userId: {
    type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, 
  {
    timestamps: false,
    tableName: 'posts',
    schema: 'project'
  })

  module.exports = Post