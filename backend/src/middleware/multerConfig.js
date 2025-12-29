// src/middlewares/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
            cloudinary,
            params: {
                        folder: "documents",           // 👈 Cloud folder name
                        allowedFormats: ["jpeg", "png", "jpg", "pdf"]
            },
});

export const upload = multer({ storage });
