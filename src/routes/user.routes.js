const express = require("express")
const {home, signup, sigin, getUsers, getUser} = require("../controllers/user.controller")

const router = express.Router()

router.get("/", home)
router.post("/signup", signup)
router.post("/signin", sigin)
router.get("/getusers", getUsers)
router.get("/getUser/:id",getUser)

module.exports = router