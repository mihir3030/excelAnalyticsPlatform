import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalFileName: {
      type: String,
      required: true,
    },

    cloudinaryUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
    },

    fileType: {
      type: String,
    },

    uploadedAt: {
      type: Date,
      default: Date.now(),
    },

    columns: {
      type: [String], // array of column header form excel file
      required: true,
    },

    rowCount: {
      type: Number,
    },
    dataSample: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Upload = mongoose.model("Upload", uploadSchema);

export default Upload;
