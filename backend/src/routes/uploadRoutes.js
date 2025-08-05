import express from 'express'
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware.js'
import { uploadFileController, getUserUpload, getFileByIdController, deleteFileController } from '../controllers/uploadController.js';


const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })


// excel upload routes
router.post("/upload", authMiddleware, upload.single("file"), uploadFileController)
router.get("/get-files", authMiddleware, getUserUpload)
router.get("/get-files/:id", authMiddleware, getFileByIdController)
router.delete("/delete-file/:id", authMiddleware, deleteFileController)

export default router