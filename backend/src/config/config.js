import { config } from "dotenv";
config();

const _config = {
            PORT: process.env.PORT,
            MONGO_URL: process.env.MONGO_URL,
            JWT_SECRET: process.env.JWT_SECRET,
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            CALLBACK_URL: process.env.CALLBACK_URL,
            GEMINI_API_KEY: process.env.GEMINI_API_KEY
}

export default Object.freeze(_config);