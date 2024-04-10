const { DataTypes } = require('sequelize')
const sequelize = require("../db/index")
const User = require('./user.model')
const Comment = require("./comment.model")

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
    timestamps: true,
    tableName: 'posts',
    schema: 'project'
  })
  
  Post.belongsTo(User, { foreignKey: 'userId'});
  Comment.belongsTo(Post, {foreignKey: 'postId'});
  // Post.hasMany(Comment); 
  // Comment.belongsTo(Post)
  // Comment.belongsTo(Post, {foreignKey: 'postId'});

  module.exports = Post

