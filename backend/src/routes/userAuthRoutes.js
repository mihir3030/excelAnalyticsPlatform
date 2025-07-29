import express from 'express'
import { signup, login, logout, checkUser, getUsers } from '../controllers/authControllers.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

// createrouter
const router = express.Router()

// create routes for User Authentication
// router.get("/signup", (req, res) => {
//     res.send("signupp done")
// })

//signUp Route
router.post("/signup", signup)

//for Login
router.post("/login", login)

// for Logout
router.post("/logout", logout)


// dashoard user info get
router.get("/dashboard", authMiddleware, (req, res) => {
    // req.user contains verified user data
    res.json({user: req.user});
})

// check current user
router.get("/checkUser", checkUser)

// get all users
router.get("/getUsers", getUsers)

export default router