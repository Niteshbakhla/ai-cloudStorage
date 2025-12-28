import User from "../models/authModel.js";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";
import config from "../config/config.js";
import asyncHandler from "../middleware/asyncHandler.js";


const isProduction = config.NODE_ENV === "production";
// Register
export const register = asyncHandler(async (req, res) => {
            const { name, email, password } = req.body;
            if (!name || !email || !password) throw new CustomError("Fields are required", 400);

            const existingUser = await User.findOne({ email });
            if (existingUser) throw new CustomError("Email already registered", 409)

            const newUser = new User({
                        name,
                        email,
                        password,
            });
            await newUser.save();

            res.status(201).json({ message: "User registered successfully" });

});

// Login
export const login = asyncHandler(async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password)
                        throw new CustomError("Both fields are required", 400);

            const user = await User.findOne({ email });
            if (!user)
                        throw new CustomError("User not found", 404);

            const isMatch = await user.comparePassword(password)
            if (!isMatch)
                        throw new CustomError("Invalid credentials", 400);

            const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, config.JWT_SECRET, { expiresIn: "7d" });
            res.cookie("token", token, {
                        secure: config.NODE_ENV === "production",
                        httpOnly: true,
                        sameSite: config.NODE_ENV === "production" ? "none" : "lax"
            })

            res.status(200).json({ message: "login successfully", user: { id: user._id, name: user.name, email: user.email } });
});

export const isMe = asyncHandler(async (req, res) => {
            res.status(200).json({ success: true })
});

// Logout (for frontend - just delete token on client side)
export const logout = asyncHandler(async (req, res) => {
            res.clearCookie("token")
            res.status(200).json({ message: "Logged out successfully" });
});



export const googleCallback = asyncHandler(async (req, res) => {
            const authUser = req.user;

            let user = await User.findOne({ email: authUser.email }); // ✅ use let here

            if (!user) {
                        user = new User({ name: authUser.name, email: authUser.email, authType: "google" })
                        await user.save();
            }

            const token = jwt.sign(
                        {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email,
                        },
                        config.JWT_SECRET
            );
            res.cookie("token", token, {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: isProduction ? "none" : "lax"
            });
            res.redirect(config.CLIENT_URL);
});
