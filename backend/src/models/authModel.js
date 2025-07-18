import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
            name: {
                        type: String,
                        required: [true, "Name is required"],
                        lowercase: true
            },
            email: {
                        type: String,
                        unique: true,
                        required: true
            },
            password: {
                        type: String,
                        minlength: true
            },
            authType: {
                        type: String,
                        enum: ["manual", "google"],
                        default: "manual"
            }
});

userSchema.pre("save", async function (next) {
            if (!this.isModified("password")) return next();
            this.password = await bcrypt.hash(this.password, 10);
            next();
});

userSchema.methods.comparePassword = async function (password) {
            return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema)

export default User;
