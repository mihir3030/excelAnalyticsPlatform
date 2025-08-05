// controllers/adminController.js
import User from '../models/userModel.js'
import Upload from '../models/uploadModel.js'
import Analysis from '../models/analysisModel.js'
import mongoose from 'mongoose' // Added for ObjectId conversion
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken'; // make sure this is imported



export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // 2. Verify admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // 3. Check password using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Wrong Email or Password' });
    }

    // 4. Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Return success response
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
      token
    });

  } catch (error) {
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

// Get all users with their upload and analysis counts
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'uploads',
          localField: '_id',
          foreignField: 'user', // Changed from userId to user to match your schema
          as: 'uploads'
        }
      },
      {
        $lookup: {
          from: 'analyses', // Changed from reports to analyses
          localField: '_id',
          foreignField: 'user', // Changed from userId to user
          as: 'analyses'
        }
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          role: 1,
          profilePic: 1,
          createdAt: 1,
          uploadsCount: { $size: '$uploads' },
          analysesCount: { $size: '$analyses' }, // Changed from reportsCount
          savedChartsCount: { $size: '$analyses' }, // This represents saved charts
          lastActivity: {
            $max: [
              { $max: '$uploads.uploadedAt' },
              { $max: '$analyses.createdAt' }
            ]
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ])

    res.status(200).json({
      success: true,
      users,
      totalUsers: users.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    })
  }
}

// Get user details with files and saved charts (with pagination)
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params
    const { 
      uploadsPage = 1, 
      uploadsLimit = 10, 
      chartsPage = 1, 
      chartsLimit = 10 
    } = req.query
    
    const user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get user's uploads with pagination
    const uploads = await Upload.find({ user: userId })
      .sort({ uploadedAt: -1 })
      .limit(uploadsLimit * 1)
      .skip((uploadsPage - 1) * uploadsLimit)
      .select('originalFileName fileType uploadedAt rowCount columns cloudinaryUrl')

    const totalUploads = await Upload.countDocuments({ user: userId })

    // Get user's saved charts/analyses with pagination
    const savedCharts = await Analysis.find({ user: userId })
      .populate('upload', 'originalFileName fileType')
      .sort({ createdAt: -1 })
      .limit(chartsLimit * 1)
      .skip((chartsPage - 1) * chartsLimit)

    const totalCharts = await Analysis.countDocuments({ user: userId })

    const lastUploadDate = uploads.length > 0 ? uploads[0].uploadedAt : null
    const lastChartDate = savedCharts.length > 0 ? savedCharts[0].createdAt : null

    let lastActivity = null
    if (lastUploadDate && lastChartDate) {
      lastActivity = new Date(Math.max(new Date(lastUploadDate), new Date(lastChartDate)))
    } else if (lastUploadDate) {
      lastActivity = lastUploadDate
    } else if (lastChartDate) { 
      lastActivity = lastChartDate
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        lastActivity
      },
      uploads: {
        data: uploads,
        pagination: {
          currentPage: parseInt(uploadsPage),
          totalPages: Math.ceil(totalUploads / uploadsLimit),
          total: totalUploads
        }
      },
      savedCharts: {
        data: savedCharts,
        pagination: {
          currentPage: parseInt(chartsPage),
          totalPages: Math.ceil(totalCharts / chartsLimit),
          total: totalCharts
        }
      },
      statistics: {
        totalUploads,
        totalSavedCharts: totalCharts,
        lastUpload: uploads[0]?.uploadedAt,
        lastChartSaved: savedCharts[0]?.createdAt
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details',
      error: error.message
    })
  }
}

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "user" or "admin"'
      })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    })
  }
}

// Delete user and their data
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params

    // Delete user's uploads and analyses
    await Upload.deleteMany({ user: userId })
    await Analysis.deleteMany({ user: userId })
    
    // Delete user
    const user = await User.findByIdAndDelete(userId)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    })
  }
}

// Get admin dashboard statistics
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' })
    const totalAdmins = await User.countDocuments({ role: 'admin' })
    const totalUploads = await Upload.countDocuments()
    const totalSavedCharts = await Analysis.countDocuments()
    
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })
    
    const recentUploads = await Upload.countDocuments({
      uploadedAt: { $gte: thirtyDaysAgo }
    })

    const recentCharts = await Analysis.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })

    // Monthly upload statistics for charts
    const monthlyUploadStats = await Upload.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$uploadedAt' },
            year: { $year: '$uploadedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ])

    // Monthly chart creation statistics
    const monthlyChartStats = await Analysis.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ])

    // Chart type distribution
    const chartTypeStats = await Analysis.aggregate([
      {
        $group: {
          _id: '$chartType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalUploads,
        totalSavedCharts,
        recentUsers,
        recentUploads,
        recentCharts,
        monthlyUploadStats,
        monthlyChartStats,
        chartTypeStats
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
      error: error.message
    })
  }
}

// Delete user's specific upload
export const deleteUserUpload = async (req, res) => {
  try {
    const { userId, uploadId } = req.params
    
    // Verify the upload belongs to the user
    const upload = await Upload.findOne({ _id: uploadId, user: userId })
    
    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found or does not belong to this user'
      })
    }

    // Delete the upload
    await Upload.findByIdAndDelete(uploadId)
    
    // Also delete associated analyses/charts
    await Analysis.deleteMany({ upload: uploadId })

    res.status(200).json({
      success: true,
      message: 'Upload and associated charts deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete upload',
      error: error.message
    })
  }
}

// Delete user's specific saved chart
export const deleteUserChart = async (req, res) => {
  try {
    const { userId, chartId } = req.params
    
    // Verify the chart belongs to the user
    const chart = await Analysis.findOne({ _id: chartId, user: userId })
    
    if (!chart) {
      return res.status(404).json({
        success: false,
        message: 'Chart not found or does not belong to this user'
      })
    }

    // Delete the chart
    await Analysis.findByIdAndDelete(chartId)

    res.status(200).json({
      success: true,
      message: 'Chart deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete chart',
      error: error.message
    })
  }
}

// Delete specific upload
export const deleteUpload = async (req, res) => {
  try {
    const { uploadId } = req.params
    
    const upload = await Upload.findByIdAndDelete(uploadId)
    
    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      })
    }

    // Also delete associated analyses/charts
    await Analysis.deleteMany({ upload: uploadId })

    res.status(200).json({
      success: true,
      message: 'Upload and associated charts deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete upload',
      error: error.message
    })
  }
}

// Delete specific saved chart
export const deleteSavedChart = async (req, res) => {
  try {
    const { chartId } = req.params
    
    const chart = await Analysis.findByIdAndDelete(chartId)
    
    if (!chart) {
      return res.status(404).json({
        success: false,
        message: 'Saved chart not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Saved chart deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete saved chart',
      error: error.message
    })
  }
}

// Get user activity summary
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params
    const { days = 30 } = req.query

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))

    const userExists = await User.findById(userId)
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get uploads in date range
    const uploads = await Upload.find({
      user: userId,
      uploadedAt: { $gte: startDate }
    }).sort({ uploadedAt: -1 })

    // Get saved charts in date range
    const savedCharts = await Analysis.find({
      user: userId,
      createdAt: { $gte: startDate }
    }).populate('upload', 'originalFileName').sort({ createdAt: -1 })

    // Daily activity breakdown
    const dailyActivity = await Analysis.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          chartsSaved: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ])

    res.status(200).json({
      success: true,
      activity: {
        uploads,
        savedCharts,
        dailyActivity,
        summary: {
          totalUploads: uploads.length,
          totalChartsSaved: savedCharts.length,
          activeDays: dailyActivity.length
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: error.message
    })
  }
}