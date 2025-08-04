import express from 'express';
import { getAllUsers } from '../controllers/adminControllers.js'


const router = express.Router();


//get all users
router.get("/users", getAllUsers)


export default router