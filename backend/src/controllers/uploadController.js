import cloudinary from "../configs/cloudinary.js";
import Upload from '../models/uploadModel.js'
import XLSX from 'xlsx'


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
                    format: 'xlsx'  // or keep original
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

