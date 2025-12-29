import { config } from "dotenv";
config();

const _config = {
            // Server
            PORT: process.env.PORT,
            NODE_ENV: process.env.NODE_ENV,

            // Database
            MONGO_URL: process.env.MONGO_URL,

            // Authentication
            JWT_SECRET: process.env.JWT_SECRET,
            SECRET: process.env.SECRET,

            // Google OAuth
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            CALLBACK_URL: process.env.CALLBACK_URL,

            // Gemini API
            GEMINI_API_KEY: process.env.GEMINI_API_KEY,

            // CORS / Client
            CLIENT_URL: process.env.CLIENT_URL,

            // Cloudinary
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default Object.freeze(_config);