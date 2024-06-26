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
    
            const newUser = await User.create({ // creating a new user if user doesn't exists
                username: username,
                password: hashedPassword,
                email: email,
            })
    
            // generating token
            const token = jwt.sign({username: username, id: newUser.id}, secret_key, {expiresIn: '5d'})
            await newUser.update({token: token})
            // console.log("token", token); 
        res.status(200).json({username: username, password: password, email: email, token: token})

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

        const token = jwt.sign({id: existingUser.id, email: existingUser.email, username: existingUser.username}, secret_key, {expiresIn: '5d'}) // matching token for existing user 
        // const decodedToken = jwt.decode(token)
        // res.status(200).json({username: username, email: email, password: password, token})
        // console.log("signin token", token);
        // console.log("decoded token", decodedToken);
        // console.log("email", email);
        // console.log("username", username);
        // console.log("password", password);
        // console.log("id", existingUser.id);
        // console.log("id", id);
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
        // console.log(password);
        
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
            // console.log(hashPassword);
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
        return res.send("user does not exists")
    }

    // user exists: creating a new secret and generating a new token by using it
    const secret = user.username + secret_key
    const token = jwt.sign({username : username}, secret, {expiresIn: '15m'})

    user.usedToken = token
    await user.save()
    
    // creating link
    const link = `http://localhost:3000/users/resetpassword/${token}`
    // console.log(link);
    
    // sending email
    const info = await transporter.sendMail({
        from: 'yamini.soni@novagems.in',
        to: 'yaminisoni00@gmail.com', 
        subject: 'Password reset link',
        html: `<a href=${link}>Click here to reset password</a>`
    })

    console.log(`password sent to the email`);

    res.send("Reset password link sent to the email")
}

// function to save new password data in db after clicking the link
const userPasswordReset = async(req, res) => {
    // need to verify user 
    const { password } = req.body
    // console.log("NEW PASSWORD ENTERED BY USER", password);
    // need username and token from url
    const {username, token} = req.params // need to pass username and token in url while routing
    if (!token || !username) {
        return res.status(400).send("token and username are required");
    }

    const user = await User.findOne({
        where: {
            username: username
        }
    })
    if(!user){
        res.send("user not found")
    }

    // user.usedToken = token
    // await user.save()


    // creating a new token using username and existing secret key
    const new_secret = user.username + secret_key
    // console.log("NEW SECRET", new_secret);
    // verifying new_token and token we got from reset link
    try {
        jwt.verify(token, new_secret)

        if(!password){
            res.send("password is required")
        }

        if(user.usedToken !== token){
            return res.send("token has already been used")
        }
        // hashing password and updating it in db
        const newHashPassword = await bcrypt.hash(password, 10)
        user.password = newHashPassword
        // user.usedToken = token
        user.usedToken = null
        await user.save()
        // console.log("NEW HASHED PASSWORD", newHashPassword);
        res.send("password reset successfully")
        
    } catch (error) {
        console.log("TOKEN VERIFICATION ERROR", error);
        return res.send("cannot proceed further due to token expiry or token mismatch")
    }
}


module.exports = { home, signup, signin, getUsers, getUser, changePassword, passwordReset, userPasswordReset }