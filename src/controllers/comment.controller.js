const Comment = require("../models/comment.model")
const Post = require("../models/post.model")
const { post } = require("../routes/user.routes")

// adding comments on post
const addComment = async(req, res) => {
    const { postId } = req.params
    const { text } = req.body

    try {
        const post = await Post.findOne({
            where: {
                id: postId
            }
        })
        if(!post){
            res.status(404).json({message: "no post found"})
        }

        const newComment = await Comment.create({
            text: text,
            postId: postId
        })
        
        await newComment.save()
        // console.log("new comment", newComment);
        res.status(200).json({newComment})
    } catch (error) {
        console.log("adding comment error", error);
        res.send("some error")
    }
}

// getting all comments with post associations and relations; regex; raw postgres sql query
const getComment = async(req, res) => {
    const {postId} = req.params
    try {
        try {
            
            const comments = await Comment.findAll({
                where: {
                    postId: postId
                }
            })
            const post = await Post.findByPk(postId)
            const response = {
                post: {
                    id: post.id,
                    title: post.title,
                    createdAt: post.createdAt
                },
                comments: comments
            }

            res.status(200).json({response})
        } catch (error) {
            console.log("===============", error);
        }
    } catch (error) {
        console.log("cannot get comments", error);
        res.send("cannot get comments")
    }
}

module.exports = {addComment, getComment}