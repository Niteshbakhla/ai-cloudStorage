import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
            filename: String,
            originalName: String,
            fileType: String,
            size: Number,
            filePath: String,
            owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            
            aiSummary: String,
            aiTags: [String],
            aiCategory: String,
            aiProcessed: { type: Boolean, default: false },
            aiProcessingStatus: {
                        type: String,
                        enum: ["pending", "processing", "completed", "failed"],
                        default: "pending"
            }
}, { timestamps: true });

export default mongoose.model("File", fileSchema);
