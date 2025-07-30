import express from 'express'
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware.js'
import { uploadFileController } from '../controllers/uploadController.js';


const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })


// excel upload routes
router.post("/upload", authMiddleware, upload.single("file"), uploadFileController)

export default router