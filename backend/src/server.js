import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './configs/db.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userAuthRoutes from './routes/userAuthRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import analysisRoutes from './routes/analysisRoutes.js'

dotenv.config()
// create express app
const app = express();

// for etracting data from req.body into json
app.use(express.json())
app.use(cookieParser())
// use cross-origin for backend connect to frontend diffrent port


const allowedOrigins = [
  'http://localhost:5173',
  'https://astounding-quokka-f9691b.netlify.app'  // netlify
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
//   credentials: true
}));

//##############################
// --------- USER AUTH  --------
app.use("/api/auth", userAuthRoutes)


//##############################
// --------- UPLOAD --------
app.use("/api/uploads", uploadRoutes)


//##############################
// --------- Analysis Report --------
app.use("/api/analysis", analysisRoutes)

//##############################
// --------- ADMIN -------------
app.use("/api/admin", adminRoutes)


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("server running on " + PORT);
    connectDB();
})
