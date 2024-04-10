const dotenv = require("dotenv").config()
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "yamini.soni@novagems.in",
        pass: "hcyenmrnqoozvbkt"
    }
})

module.exports = transporter