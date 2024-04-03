const express = require("express")
const {createPost, getPost, getAllPost, updatePost, deletePost} = require("../controllers/post.controller")
const auth = require("../middleware/auth")

const postRouter = express.Router()

postRouter.get("/get", auth, getPost)
postRouter.get("/get-all-posts", auth, getAllPost)

postRouter.post("/create", auth, createPost)

postRouter.put("/update/:id", auth, updatePost)

postRouter.delete("/delete/:id", auth, deletePost)

module.exports = postRouter