import mongoose from 'mongoose'

const analysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    upload: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upload',
        required: true,
  },

  chartType: {
    type: String,
    required: true
  },

  xAxis: {
    type: String,
    required: true,
  },
  yAxis: {
    type: String,
    required: false   // for pie chart
  },

  zAxis: {
    type: String,
    required: false   // for pie chart
  },
  
   aggregation: {  // Add this field
        type: String,
        default: 'sum'
    },

  aiSummary: {
    type: String,
    default: ''
  }

}, { timestamps: true })

const Analysis = mongoose.model("Analysis", analysisSchema)

export default Analysis