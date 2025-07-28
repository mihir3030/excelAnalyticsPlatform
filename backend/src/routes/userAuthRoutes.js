import express from 'express'
import { signup, login } from '../controllers/authControllers.js'

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

export default router