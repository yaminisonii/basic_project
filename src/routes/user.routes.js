const express = require("express")
const {home, signup, signin, getUsers, getUser, changePassword, passwordReset, userPasswordReset} = require("../controllers/user.controller")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/", home)
// login process
router.post("/signup", signup)
router.post("/signin", signin)

//getting all users
router.get("/getusers", auth, getUsers)
router.get("/getUser/:id", auth, getUser)

// change and reset password
router.post("/change-password", auth, changePassword)
router.post("/reset-password", passwordReset)
router.post("/user-reset-password/:username/:token", userPasswordReset)


module.exports = router