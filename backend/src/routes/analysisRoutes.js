import express from 'express'
import { saveAnalysisController, getUserAnalysisController, deleteAnalysisController } from "../controllers/analysisController.js";
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router()


// save Chart report
router.post("/save", authMiddleware, saveAnalysisController)
router.get("/reports", authMiddleware, getUserAnalysisController)
router.delete('/:id', authMiddleware, deleteAnalysisController);


export default router