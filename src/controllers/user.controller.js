const express = require("express")
const User = require("../models/user.model")
const { Op } = require("sequelize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret_key = '123456'

const home = (req, res) => {
    res.send("working")
}

//signin
const signup = async(req, res) => {
    let {username, email, password} = req.body

    try {
        const existingUser = await User.findOne({ // finding user in db
            where: {
                [Op.or]: [
                    {username: username},
                    {email: email}
                ]
            }
        })

        if(existingUser){
            return res.json("user already exists")
        }

        const hashedPassword = await bcrypt.hash(password, 10) // hashing password
        const token = jwt.sign({username: username, email: email, password: password}, secret_key) // generating token

        const newUser = User.create({ // creating a new user if user doesn't exists
            username: username,
            password: hashedPassword,
            email: email
        })
        res.json({username: username, password: password, email: email, token})

    } catch (error) {
        return error
    }
}

// signin
const sigin = async(req, res) => {
    let {username, email, password} = req.body

    try {
        const existingUser = await User.findOne({ // searching for user in db
            where: {
                [Op.or]: [
                    {username: username},
                    {email: email}
                ]
            }
        })

        if(!existingUser){ // if user doesnt exists 
            res.send("user doesn't exists")
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password) // if user exists; matching password

        if(!matchPassword){
            res.send("invalid credentials")
        }

        const token = jwt.sign({id: existingUser.id, email: existingUser.email}, secret_key) // matching token for existing user 
        // res.status(200).json({email: email, password: password, token})
        res.send("signed in")
    } catch (error) {
        return error
    }
}

// show all the users
const getUsers = async(req, res) => {
    try {
        const users = await User.findAll({})
        res.status(200).json({users: users})
    } catch (error) {
        console.log("get user error", error);
    }
}

// show particular user using id 
const getUser = async(req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json(user)
    } catch (error) {
        return error
    }
}

module.exports = { home, signup, sigin, getUsers, getUser }