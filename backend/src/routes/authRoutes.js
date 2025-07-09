import { Router } from "express";
import { googleCallback, isMe, login, logout, register } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import passport from "passport";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, isMe);
router.route("/google").get(passport.authenticate("google", { scope: ['profile', 'email'] }));
router.route("/google/callback").get(passport.authenticate('google', { session: true }), googleCallback);


export default router;