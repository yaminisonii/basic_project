const express = require("express")
require("dotenv").config()
const router = require("./src/routes/user.routes")
const postRouter = require("./src/routes/post.router")
const sequelize =  require("./src/db/index")
const User =  require("./src/models/user.model")
const Post = require("./src/models/post.model")
const Comment = require("./src/models/comment.model")

const app = require("./app")

app.use(express.json())
app.use("/users", router)
app.use("/posts", postRouter)

try {
    sequelize
    console.log("db connected");
} catch (error) {
    console.log("db error");
}

User.sync({force : false})
User.sync({alter: true})

Post.sync({force: false})
Post.sync({alter: true})

Comment.sync({force : false}) 
Comment.sync({alter: true})

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log(`server started`);
})

