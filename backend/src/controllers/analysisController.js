import Analysis from "../models/analysisModel.js";

export const saveAnalysisController = async (req, res) => {
  try {
    const { uploadId, chartType, xAxis, yAxis, zAxis, aiSummary } = req.body;
    const userId = req.user._id;

    //if empty
    // Validate required fields
    if (!uploadId || !chartType || !xAxis) {
      return res.status(400).json({
        message: "Upload ID, chart type, and X-axis are required",
      });
    }

    // check if analysis with same parameter already exist or not
    const exisitingAnalysis = await Analysis.findOne({
      user: userId,
      upload: uploadId,
      chartType,
      xAxis,
      yAxis: yAxis || null,
      zAxis: zAxis || null,
    });

    if (exisitingAnalysis) {
      return res.status(409).json({
        message: "Analysis with these parameters already exists",
        analysis: exisitingAnalysis,
      });
    }

    // create new Analysis
    const newAnalysis = new Analysis({
      user: userId,
      upload: uploadId,
      chartType,
      xAxis,
      yAxis: yAxis || undefined,
      zAxis: zAxis || undefined,
      aiSummary: aiSummary || "",
    });

    await newAnalysis.save();

    // populate the response with upload details
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

// get user saved analysis
export const getUserAnalysisController = async (req, res) => {
  try {
    const userId = req.user._id;

    const analysis = await Analysis.find({ user: userId })
      .populate("upload", "originalFileName")
      .populate("user", "username email") // optional if you want user info too
      .sort({ createdAt: -1 }); // ← if you want newest first

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({
      message: `Error fetching analyses: ${error.message}`,
    });
  }
};
