import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './configs/db.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userAuthRoutes from './routes/userAuthRoutes.js'

dotenv.config()
// create express app
const app = express();

// for etracting data from req.body into json
app.use(express.json())
app.use(cookieParser())
// use cross-origin for backend connect to frontend diffrent port
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true  // allow cookie to accpets for authentication
}))


//##############################
// --------- USER AUTH  --------
app.use("/api/auth", userAuthRoutes)


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("server running on " + PORT);
    connectDB();
})