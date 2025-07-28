import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './configs/db.js';

dotenv.config()
// create express app
const app = express();


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("server running on " + PORT);
    connectDB();
})