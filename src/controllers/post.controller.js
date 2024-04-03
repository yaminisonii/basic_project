const Post = require("../models/post.model")


const createPost = async(req, res) => {
    let {title, description} = req.body

    const newPost = await Post.create({ // getting data from user 
        title: title,
        description: description,
        userId: req.userId
    });

    try {
        await newPost.save() // saving the note in db
        res.status(201).json({newPost})
    } catch (error) {
        console.log("db save error", error);
        res.send("something went wrong")
    }

}
// getting all posts corresponding to single user
const getPost = async(req, res) => {
    try {
        const posts = await Post.findAll({ // finding all the posts corresponding to single user using userId from user model
            where: {
                userId: req.userId
            }
        })
        res.status(200).json({posts})
    } catch (error) {
        console.log("get post error", error);
        res.send("something went wrong")
    }
}

// getting all the posts in db
const getAllPost = async(req, res) => {
    try {
        const posts = await Post.findAll({}) // finding all the posts stored in the db
        res.status(200).json({posts})
    } catch (error) {
        console.log("cannot get all posts", error);
        res.send("something went wrong")
    }
}

const updatePost = async(req, res) => {
    const id = req.params.id // getting id for user from url
    const {title, description} = req.body

    const newPost = {
        title: title,
        description: description,
        userId: req.userId
    }

    try {
        await Post.update(newPost, {
            where: {id: id},
            returning: true
        })
        res.status(200).json({newPost})
    } catch (error) {
        console.log("cannot update", error);
        res.send("something went wrong")
    }
}

const deletePost = async(req, res) => {
    const id = req.params.id;
    try {
        const note = await Post.destroy({
            where: {id: id}
        })
        res.status(202).json({note})
    } catch (error) {
        console.log("cannot delete", error);
        res.send("something went wrong")
    }
}


module.exports = {createPost, getPost, getAllPost, updatePost, deletePost}