import User from "../models/userModel.js"
import Upload from "../models/uploadModel.js"
import Analysis from "../models/analysisModel.js"

export const getAllUsers = async () => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'uploads',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'uploads'
                }
            },
            {
                $lookup: {
                    from: 'analysis',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'analysis'
                }
            },
            {
                $project: {
                    fullName: 1,
                    email: 1,
                    role: 1,
                    profilePic: 1,
                    createdAt: 1,
                    uploadCount: { $size: '$uploads' },
                    
                },
            }

        ])
    } catch (error) {
        
    }
}