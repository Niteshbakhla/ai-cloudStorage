import { config } from "dotenv";
config();

const _config = {
            PORT: process.env.PORT,
            MONGO_LOCAL_URL: process.env.MONGO_LOCAL_URL,
            MONGO_CLOUD_URL: process.env.MONGO_CLOUD_URL,
            JWT_SECRET: process.env.JWT_SECRET,
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            CALLBACK_URL: process.env.CALLBACK_URL,
            GEMINI_API_KEY: process.env.GEMINI_API_KEY,
            NODE_ENV: process.env.NODE_ENV,
            SECRET: process.env.SECRET,
            CLIENT_URL: process.env.CLIENT_URL
}

export default Object.freeze(_config);