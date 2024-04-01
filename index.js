const express = require("express")
require("dotenv").config()
const router = require("./src/routes/user.routes")
const sequelize =  require("./src/db/index")
const User =  require("./src/models/user.model")

const app = require("./app")

app.use(express.json())
app.use("/users", router)

try {
    sequelize
    console.log("db connected");
} catch (error) {
    console.log("db error");
}

User.sync({force : false})
// User.sync({alter: true})

app.listen(process.env.PORT, (req, res) => {
    console.log(`server started ${process.env.PORT}`);
})

