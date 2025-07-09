import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import config from "./config.js";

passport.use(new GoogleStrategy({
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
            try {
                        const user = {
                                    id: profile.id,
                                    name: profile.displayName,
                                    email: profile.emails[0].value
                        }
                        return done(null, user);
            } catch (error) {
                        return done(error, null);
            }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user))


