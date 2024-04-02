const express = require("express")
const User = require("../models/user.model")
const { Op } = require("sequelize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const  transporter  = require("../config/email.config")
const secret_key = '123456'


const home = (req, res) => {
    res.send("working")
}

//signup
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
        const token = jwt.sign({username: username}, secret_key, {expiresIn: '5d'}) // generating token

        const newUser = User.create({ // creating a new user if user doesn't exists
            username: username,
            password: hashedPassword,
            email: email,
            token: token
        })
        res.json({username: username, password: password, email: email, token: token})

    } catch (error) {
        return error
    }
}

// signin
const signin = async(req, res) => {
    let {username, email, password} = req.body

    try {
        const existingUser = await User.findOne({ // searching for user in db
            where: {
                [Op.or]: [
                    {username: username},
                    {email: email},
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

        const token = jwt.sign({id: existingUser.id, email: existingUser.email}, secret_key, {expiresIn: '5d'}) // matching token for existing user 
        // res.status(200).json({username: username, email: email, password: password, token})
        res.send("signed in")
    } catch (error) {
        return error
    }
}

// show all the users
const getUsers = async(req, res) =>  {
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

// changing password
const changePassword = async(req, res) => {
    try {
        const {email, password} = req.body
        // checking if email and password is given by the user
        if(!password || !email){
            return res.send("all fields are required")
        }
        console.log(password);
        
        // checking if email and password is correct
        const user = await User.findOne({
            where: [
                {email: email}
            ]
        })
        if(!user){
            return res.send("user doesn't exists")
        }
        // hashing password if credentials are correct
        const hashPassword = await bcrypt.hash(password, 10)
            user.password = hashPassword
        // saving new password in db
            await user.save()
            res.send("password changed")
            console.log(hashPassword);
    } catch (error) {
        console.log("error while updating password", error);
    }
}

// send reset password email to user
const passwordReset = async(req, res) => {
    const {username, email} = req.body // getting email from frontend
    if(!email && !username){
        return res.send("all fields are required")
    }

    // checking if the email is registered or not
    const user = await User.findOne({
        where: [
            {email: email}, {username: username}
        ]
    })
    if(!user){
        return res.send("email does not exists")
    }

    // user exists: creating a new secret and generating a new token by using it
    const secret = user.username + secret_key
    const token = jwt.sign({username : username}, secret, {expiresIn: '10m'})
    // creating link
    const link = `http://localhost:3000/users/resetpassword/${token}`
    console.log(link);
    
    // sending email
    const info = await transporter.sendMail({
        from: 'xyz@gmail.com',
        to: 'yaminisoni@gmail.com',
        subject: 'Password reset link',
        html: `<a href=${link}>Click here to reset password</a>`
    })

    console.log(`password sent to ${to}`);

    res.send("Reset password link sent to the email")
}

// function to save new password data in db after clicking the link
const userPasswordReset = async(req, res) => {
    // need to verify user 
    const { password } = req.body
    console.log("NEW PASSWORD ENTERED BY USER", password);
    // need username and token from url
    const {username, token} = req.params // need to pass username and token in url while routing
    if(!username){
        res.send("username is required")
    }

    const user = await User.findOne({
        where: {
            username: username
        }
    })
    if(!user){
        res.send("user not found")
    }
    // creating a new token using username and existing secret key
    const new_secret = user.username + secret_key
    console.log("NEW SECRET", new_secret);
    // verifying new_token and token we got from reset link
    try {
        jwt.verify(token, new_secret)
        if(!password){
            res.send("password is required")
        }
        // hashing password and updating it in db
        const newHashPassword = await bcrypt.hash(password, 10)
        user.password = newHashPassword
        await user.save()
        console.log("NEW HASHED PASSWORD", newHashPassword);
        res.send("password reset successfully")
    } catch (error) {
        console.log("TOKEN VERIFICATION ERROR", error);
        return res.send("cannot proceed further")
    }
}


module.exports = { home, signup, signin, getUsers, getUser, changePassword, passwordReset, userPasswordReset }