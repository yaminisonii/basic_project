const express = require("express")
const {createPost, getPost, getAllPost, updatePost, deletePost,
    filterPost, searchPost, pagination, getAllInfo} = require("../controllers/post.controller")
const {addComment, getComments, getComment} = require("../controllers/comment.controller")
const auth = require("../middleware/auth")

const postRouter = express.Router()

postRouter.get("/get", auth, getPost)
postRouter.get("/get-all-posts", auth, getAllPost)

postRouter.post("/create", auth, createPost)

postRouter.put("/update/:id", auth, updatePost)

postRouter.delete("/delete/:id", auth, deletePost)


// filter, search, sort, pagination
postRouter.get("/filter", auth, filterPost)
postRouter.get("/search", auth, searchPost)
postRouter.get("/pagination", auth, pagination)
postRouter.get("/get-all-info", auth, getAllInfo )

// comments
postRouter.post("/:postId/comment", auth, addComment)
postRouter.get("/:postId/getComment", auth, getComment)
postRouter.get("/getComments", auth, getComments)

module.exports = postRouter

// 5- abhinav 7- harshit 9-priya 11-neha 15- yamini 16-rahul