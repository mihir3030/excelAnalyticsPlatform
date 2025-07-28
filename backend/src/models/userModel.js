import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "default-profile.png"
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {timestamp: true})