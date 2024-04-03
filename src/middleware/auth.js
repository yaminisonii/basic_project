const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const secret_key = '123456'
// const bcrypt = require("bcrypt")
// const passwordResetToken = require("../models/user.model")

const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        // console.log("auth token", token);
        // console.log("bearer token",token)
        // console.log(Object.keys(req));
        // console.log(require('util').inspect(req.rawHeaders, 0, null, 1));
        if(token){
            // token = token.split(" ")[1]
            // console.log("decoded token",token);
            let user = jwt.verify(token, secret_key)
            // console.log("middleware token", token);
            // console.log("user", user);
            // console.log("decoded user", user);
            // console.log("decoded user", user);
            // const users = await User.findByPk(userId);
            // const user = await User.findByPk(decodedToken.userId)
            req.userId = user.id;
            // req.username = user.username
            // console.log("middleware username", req.username);
            // console.log("middleware id ", req.userId);
            
        } else {
            console.log("not found");
            return res.status(401).json({message: "invalid user"})
        }
        next();
    } catch (error) {
        console.log("authentication error", error);
        return res.status(401).json({ message: "Authentication failed" });
    }
}

module.exports = auth