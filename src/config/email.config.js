const dotenv = require("dotenv").config()
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'xyz@gmail.com',
        pass: 'Yaminisoni'
    }
})

module.exports = transporter