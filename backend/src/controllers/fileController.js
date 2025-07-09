import path from "path";
import asyncHandler from "../middleware/asyncHandler.js";
import File from "../models/fileSchema.js";
import CustomError from "../utils/customError.js";
import { fileURLToPath } from "url"
import AIService from "../services/aiService.js";

export const uploadFile = asyncHandler(async (req, res, next) => {
            const files = req.files;
            // return console.log(files);
            const userId = req.user.id;
            if (!files || files.length === 0) throw new CustomError("File required", 400);

            const savedFiles = await Promise.all(
                        files.map((async (file) => {
                                    const newFile = new File({
                                                filename: file.filename,
                                                originalName: file.originalname,
                                                fileType: file.mimetype,
                                                size: file.size,
                                                filePath: file.path,
                                                owner: userId
                                    })

                                    await newFile.save();
                                    await AIService.queueFileForProcessing(newFile._id);
                                    return newFile;
                        }))
            )


            res.status(201).json({ message: "File uploaded successfully! AI analysis will be ready in 1-2 minutes.", file: savedFiles });
});

export const getSingleFile = asyncHandler(async (req, res) => {
            const userId = req.user.id;
            const fileId = req.params.id;

            const file = await File.findOne({ owner: userId, _id: fileId });
            if (!file)
                        throw new CustomError("File not found", 404);

            res.status(200).json({ success: true, file });
});

export const getFiles = asyncHandler(async (req, res) => {
            const userId = req.user.id;
            const files = await File.find({ owner: userId })
            // return console.log(files)
            if (files.length === 0) throw new CustomError("No files found", 404);
            res.status(200).json({ success: true, files })
});

export const deleteFile = asyncHandler(async (req, res) => {
            const userId = req.user.id;
            const fileId = req.params.id;

            const file = await File.findOne({ owner: userId, _id: fileId });
            if (!file) throw new CustomError("File not found", 404);

            await file.deleteOne();
            res.status(200).json({ message: "File deleted successfully" });
});


export const downloadFile = asyncHandler(async (req, res) => {
            const id = req.params.id;
            const userId = req.user.id;

            const file = await File.findOne({ owner: userId, _id: id });

            if (!file) {
                        throw new CustomError("File not found")
            }

            const _filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(_filename);
            const absolutePath = path.join(__dirname, "..", "uploads", file.filename);
            res.download(absolutePath, file.filename);
});

export const updateFile = asyncHandler(async (req, res) => {
            const id = req.params.id;
            const { filename } = req.body;
            const existFile = await File.findById(id)
            if (!existFile) {
                        throw new CustomError("File not found", 404);
            }


            const file = await File.findByIdAndUpdate(id, { filename }, { new: true })
            res.status(200).json({ message: "File updated" });
})