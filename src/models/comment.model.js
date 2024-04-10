const { DataTypes } = require('sequelize')
const sequelize = require("../db/index");
// const Post = require('./post.model');

const Comment = sequelize.define('Comment', {
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{   tableName: 'comments',
    schema: 'project'
})

module.exports = Comment

