import cloudinary from "../configs/cloudinary.js";
import Upload from '../models/uploadModel.js'
import XLSX from 'xlsx'
import axios from 'axios'
import path from 'path';



// Upload files
export const uploadFileController = async (req, res) => {
    try {
        if(!req.file) return res.status(400).json({message: "No File Uploaded"})
            
        // upload file if file is present
        const result = await new Promise((reslove, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",   /// because it's not image
                    folder: 'excel-files',
                    format: path.extname(req.file.originalname).slice(1),  // "xlsx" or "csv"
                    public_id: path.parse(req.file.originalname).name,  // save with original name
                    overwrite: true  // if same file name overwrite
                },
                (error, result) => {
                    if (error) reject(error);
                    else reslove(result)
                }
            );
            stream.end(req.file.buffer)
        });

        // convert excel sheet 0 o json
        const workbook = XLSX.read(req.file.buffer, {type: "buffer"})
        const sheetname = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetname];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {defval: ""})

        // extract metadata
        const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : []  // gettings all columns
        const rowCount = jsonData.length;
        const dataSample = jsonData.slice(0, 5)  // preview first 5 rows


        // save upload model
        const newUpload = new Upload({
            user: req.user._id,
            originalFileName: req.file.originalname,
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            fileType: req.file.mimetype,
            columns,
            rowCount,
            dataSample
        }) 

        await newUpload.save()
        console.log("upload success backend - ", newUpload)
        res.status(201).json({newUpload})

    } catch (error) {
        console.log("error upload backend", error);
        res.status(500).json({message: `Internal error ${error.message}`})
        
    }
}


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