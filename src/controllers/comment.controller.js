const sequelize = require("../db")
const Comment = require("../models/comment.model")
const Post = require("../models/post.model")
// const { post } = require("../routes/user.routes")

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
// const getComment = async(req, res) => {
//     const {postId} = req.params
//     console.log("post id", postId);
//     try {
//         try {
            
//             const comments = await Comment.findAll({
//                 where: {
//                     postId: postId
//                 }
//             })
//             const post = await Post.findByPk(postId)
//             const response = {
//                 post: {
//                     id: post.id,
//                     title: post.title,
//                     createdAt: post.createdAt
//                 },
//                 comments: comments
//             }

//             res.status(200).json({response})
//         } catch (error) {
//             console.log("===============", error);
//         }
//     } catch (error) {
//         console.log("cannot get comments", error);
//         res.send("cannot get comments")
//     }
// }


// getting all comments from single user
const getComment = async(req, res) => {
    const {postId} = req.params
    try {
        const result = await sequelize.query(
            `SELECT "posts"."id" AS "postId", "posts"."title" AS "postTitle",
            "posts"."createdAt" as "createdAt",
            "comments"."id" as "commentId", "comments"."text" as "commentText", "comments"."createdAt" as "createdAt"
            FROM "project"."posts"
            LEFT JOIN "project"."comments"
            ON "posts"."id" = "comments"."postId"
            where "posts"."id" = ${postId}`,
        {
        type: sequelize.QueryTypes.SELECT
        })

        if(result.length === 0){ // checking if the post is found or not
        console.log("post not found");
        res.send("post not found")
        }


        // grouping the data together 

        const post = {
            postId: result[0].postId,
            postTitle: result[0].postTitle,
            postDescription: result[0].postDescription,
            comments: result.map(res => ({
                commentId: res.commentId,
                commentText: res.commentText,
                createdAt: res.createdAt
            }))
        }
        // console.log("post", post);
        res.status(200).json({post})
    } catch (error) {
        console.log("getting one user comment error", error);
    }
}


// getting all comments
const getComments = async(req, res) => {
    const {page, limit} = req.query
    try {
        let result;
        try {
            result = await sequelize.query(
                `SELECT "posts"."id" AS "postId", "posts"."title" AS "postTitle", 
                "posts"."createdAt" AS "createdAt",
                jsonb_agg(
                    json_build_object(
                        'commentId', "comments"."id",
                        'commentText', "comments"."text",
                        'createdAt', "comments"."createdAt"
                    )
                ) AS "comments"
                FROM "project"."posts"
                LEFT JOIN "project"."comments"
                ON "posts"."id" = "comments"."postId"
                GROUP BY "posts"."id"
                ORDER BY "posts"."id" ASC
                LIMIT :limit 
                OFFSET :offset`, 
                {
                type: sequelize.QueryTypes.SELECT,
                replacements: {limit: parseInt(limit), offset: (page - 1) * limit}
                })

                // const posts = await Post.findAll(
                //     {
                //         limit: parseInt(limit), 
                //         offset: (page - 1) * limit
                //     })
                //     res.status(200).json({posts})

        } catch (error) {
            console.log("result query error", error);
        }

        res.status(200).json({result})
    } catch (error) {
        console.log("sql query error =================", error);
    }
}

module.exports = {addComment, getComments, getComment}