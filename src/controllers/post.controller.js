const Post = require("../models/post.model")
const {Op} = require("sequelize")
const User = require("../models/user.model")
const sequelize = require("../db")


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

// filter post by title
const filterPost = async(req, res) => {
    const {filterTitle} = req.query
    console.log("query", req.query);
    try {
        if (filterTitle){
            const posts = await Post.findAll({
                where: {
                    title: {
                        [Op.like]: filterTitle
                    }
                }
            })
            // console.log("post", posts);
            res.status(200).json({posts})
        }
    } catch (error) {
        console.log("filter error", error);
        res.send(error)
    }
}

// search post by username
const searchPost = async(req, res) => {
    const { searchUsername } = req.query
    // console.log("search username", searchUsername);
    try {
        if(searchUsername){
            const posts = await Post.findAll({
                where: {
                    userId: {
                        [Op.in]: sequelize.literal(
                            `(SELECT id FROM "project"."users" WHERE "username" LIKE '%${searchUsername}%')`
                        )
                    }
                },
                include: [{
                    model: User,
                    attributes: ['id', 'username', 'createdAt'],
                    as: 'User'
                }]
            })
            res.status(200).json({ list: posts })
        }
    } catch (error) {
        console.log("searching error", error);
        res.send("some error")
    }
}

// pagination
const pagination = async(req, res) => {
    const{page, limit} = req.query
    
    try {
        const posts = await Post.findAll(
            {
                limit: parseInt(limit), 
                offset: (page - 1) * limit
            })
            // console.log("posts", posts);
            res.status(200).json({posts})
    } catch (error) {
        console.log("pagination error", error);
    }
}

// get all info
const getAllInfo = async(req, res) => {
    const {filterTitle, searchUsername, page, limit, sort} = req.query
    // console.log("query", req.query);

    try {
        let queries = {};
        try {
            if (filterTitle){
                queries.where = {
                    title: {
                        [Op.iLike]: filterTitle
                    }
                }
            }
                // console.log("post", posts);
        } catch (error) {
            console.log("filter error", error);
        }

    try {
        if(searchUsername){
            queries.where = {
                userId: {
                    [Op.in]: sequelize.literal(
                        `(SELECT id FROM "project"."users" WHERE "username" ~* '${searchUsername}')` 
                    )
                }
            }
        }
    } catch (error) {
        console.log("search error", error);
    }

    if (page && limit) {
        queries.limit = parseInt(limit);
        queries.offset = (page - 1) * limit;
    }

    if(sort ==='createdAt_ASC'){
        queries.order = [['createdAt', 'ASC']];
    } else if(sort === 'createdAt_DESC'){
        queries.order = [['createdAt', 'DESC']];
    }

    const posts = await Post.findAll(queries)
    res.status(200).json({posts})

    } catch (error) {
        console.log("cannot perform query", error);
        res.send("some error")
    }
}

module.exports = {createPost, getPost, getAllPost, 
                updatePost, deletePost, filterPost, 
                searchPost, pagination, getAllInfo}
                