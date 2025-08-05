import cloudinary from "../configs/cloudinary.js";
import Upload from '../models/uploadModel.js'
import XLSX from 'xlsx'
import axios from 'axios'
import path from 'path';



// Upload files
export const uploadFileController = async (req, res) => {
    try {
        if(!req.file) return res.status(400).json({message: "No File Uploaded"})

        // Check if file already exists for this user
        const existingFile = await Upload.findOne({
            user: req.user._id,
            originalFileName: req.file.originalname
        });

        if (existingFile) {
            return res.status(400).json({
                success: false,
                message: "A file with this name already exists. Please rename your file or delete the existing one."
            });
        }
            
        // Upload file to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: 'excel-files',
                    format: path.extname(req.file.originalname).slice(1),
                    public_id: `${req.user._id}_${Date.now()}_${path.parse(req.file.originalname).name}`,
                    overwrite: false  // Prevent overwriting
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        // Process Excel data
        const workbook = XLSX.read(req.file.buffer, {type: "buffer"});
        const sheetname = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetname];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {defval: ""});

        // Create new upload record
        const newUpload = new Upload({
            user: req.user._id,
            originalFileName: req.file.originalname,
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            fileType: req.file.mimetype,
            columns: jsonData.length > 0 ? Object.keys(jsonData[0]) : [],
            rowCount: jsonData.length,
            dataSample: jsonData.slice(0, 5)
        });

        await newUpload.save();
        
        res.status(201).json({
            success: true,
            upload: newUpload,
            message: "File uploaded successfully"
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to upload file"
        });
    }
};


// get user upload files from db
export const getUserUpload = async (req, res) => {
    try {
        const userId = req.user._id

        // find upload by user
        const uploads = await Upload.find({user: userId}).sort({ createdAt: -1 })
        res.status(200).json(uploads);

    } catch (error) {
        res.status(500).json({message: `Error in getting user upload files ${error.messsage}`})
    }
}

// get  file by id controller
export const getFileByIdController = async (req, res) => {
    try {
        // get file by id
        const file = await Upload.findById(req.params.id);
        if (!file) return res.status(404).json({message: "File Not Found"})
        
        // download excel file from cloudinary and save it to memory
        const response = await axios.get(file.cloudinaryUrl, { responseType: 'arraybuffer'});

        // parse
        const workbook = XLSX.read(response.data, {type: "buffer"})
        const sheetname = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetname]

        // convert sheet to json
        const fullData = XLSX.utils.sheet_to_json(worksheet, {defval: ""});

        //send back full data and metadata
        return res.status(200).json({
            metadata: file,
            data:fullData
        })
        
    } catch (error) {
        res.status(500).json({message: "internal error"})
    }
}


// In your uploadController.js
export const deleteFileController = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Find the file to get Cloudinary public_id
        const file = await Upload.findById(id);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        // 2. Delete from Cloudinary
        await cloudinary.uploader.destroy(file.cloudinaryPublicId, {
            resource_type: "raw"
        });

        // 3. Delete from database
        await Upload.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "File deleted successfully"
        });

    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete file"
        });
    }
};