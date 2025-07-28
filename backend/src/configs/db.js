import mongoose from 'mongoose';

// this is Mongo DB config
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log("succesfully DB connected")
    } catch (error) {
        console.log(`error occured in connect db - ${error}`)
    }
}