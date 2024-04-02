const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const secret_key = '123456'
const bcrypt = require("bcrypt")
// const passwordResetToken = require("../models/user.model")

const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        // console.log("bearer token",token)
        // console.log(Object.keys(req));
        // console.log(require('util').inspect(req.rawHeaders, 0, null, 1));
        if(token){
            token = token.split(" ")[1]
            // console.log("decoded token",token);
            let user = jwt.verify(token, secret_key)
            // console.log("decoded user", user);
            req.userId = user.id
        } else {
            console.log("not found");
            return res.status(401).json({message: "invalid user"})
        }
        next();
    } catch (error) {
        return error
    }
}

module.exports = {auth}