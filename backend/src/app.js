import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./utils/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import cors from "cors";
import "./config/passport.js";
import passport from "passport";
import session from "express-session";
import config from "./config/config.js";
import MongoStore from "connect-mongo";


export const app = express();

const corsOptions = {
            origin: "https://ai-cloud-storage-six.vercel.app",
            credentials: true
}

app.use(cors(corsOptions));

app.use(session({
            secret: config.SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                        mongoUrl: config.MONGO_CLOUD_URL
            }),
            cookie: {
                        secure: config.NODE_ENV === "production",
                        httpOnly: true,
                        sameSite: config.NODE_ENV === "production" ? "none" : "lax"
            }
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/drive", fileRoutes);

app.use(errorHandler);


