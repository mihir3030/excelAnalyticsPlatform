import express from 'express'
import { saveAnalysisController, getUserAnalysisController } from "../controllers/analysisController.js";
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router()


// save Chart report
router.post("/save", authMiddleware, saveAnalysisController)
router.get("/reports", authMiddleware, getUserAnalysisController)


export default router