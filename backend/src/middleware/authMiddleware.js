import config from "../config/config.js";
import CustomError from "../utils/customError.js";
import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {

            const token = req.cookies?.token;
            if (!token) {
                        throw new CustomError("Unauthorized", 401);
            }
            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.user = decoded;
            next();
})