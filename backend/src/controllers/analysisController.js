import Analysis from "../models/analysisModel.js";

// In analysisController.js - include aggregation in save
export const saveAnalysisController = async (req, res) => {
  try {
    const { uploadId, chartType, xAxis, yAxis, zAxis, aggregation, aiSummary } = req.body;
    const userId = req.user._id;

    if (!uploadId || !chartType || !xAxis) {
      return res.status(400).json({
        message: "Upload ID, chart type, and X-axis are required",
      });
    }

    const existingAnalysis = await Analysis.findOne({
      user: userId,
      upload: uploadId,
      chartType,
      xAxis,
      yAxis: yAxis || null,
      zAxis: zAxis || null,
      aggregation: aggregation || 'sum'  // Include aggregation in check
    });

    if (existingAnalysis) {
      return res.status(409).json({
        message: "Analysis with these parameters already exists",
        analysis: existingAnalysis,
      });
    }

    const newAnalysis = new Analysis({
      user: userId,
      upload: uploadId,
      chartType,
      xAxis,
      yAxis: yAxis || undefined,
      zAxis: zAxis || undefined,
      aggregation: aggregation || 'sum',  // Save aggregation
      aiSummary: aiSummary || "",
    });

    await newAnalysis.save();

    const populatedAnalysis = await Analysis.findById(newAnalysis._id)
      .populate("upload", "originalFileName")
      .populate("user", "username email");

    res.status(201).json({
      message: "Chart analysis saved successfully",
      analysis: populatedAnalysis,
    });
  } catch (error) {
    console.error("Error saving analysis:", error);
    res.status(500).json({
      message: `Error saving analysis: ${error.message}`,
    });
  }
};

export const getUserAnalysisController = async (req, res) => {
  try {
    const userId = req.user._id;

    const analysis = await Analysis.find({ user: userId })
      .populate("upload", "originalFileName")
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    // Filter out analyses where upload is null (deleted files)
    const validAnalyses = analysis.filter(item => item.upload !== null);

    res.status(200).json(validAnalyses);
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({
      message: `Error fetching analyses: ${error.message}`,
    });
  }
};


// Add this to your analysis controller
export const deleteAnalysisController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find and delete the analysis (ensure user owns it)
    const analysis = await Analysis.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found or unauthorized"
      });
    }

    res.status(200).json({
      message: "Analysis deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    res.status(500).json({
      message: `Error deleting analysis: ${error.message}`
    });
  }
};