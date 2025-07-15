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



export const app = express();

const corsOptions = {
            origin: config.NODE_ENV === "production" ? config.CLIENT_URL : "http://localhost:5173",
            credentials: true
}

app.use(cors(corsOptions));

app.use(session({
            secret: config.SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                        secure: false,
                        httpOnly: true
            }
}))

app.use(passport.initialize());
app.use(passport.session())
app.use(cookieParser());
app.use(express.json());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/drive", fileRoutes);

app.use(errorHandler);


