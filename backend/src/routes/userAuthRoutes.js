import express from 'express'
import {signup} from '../controllers/authControllers.js'

// createrouter
const router = express.Router()

// create routes for User Authentication
// router.get("/signup", (req, res) => {
//     res.send("signupp done")
// })

//signUp Route
router.post("/signup", signup)

export default router