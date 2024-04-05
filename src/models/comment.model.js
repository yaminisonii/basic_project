const { DataTypes } = require('sequelize')
const sequelize = require("../db/index");
const Post = require('./post.model');

const Comment = sequelize.define('Comment', {
    text: {
        type: DataTypes.STRING
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{   tableName: 'comments',
    schema: 'project'
}
)

Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post'});

module.exports = Comment

