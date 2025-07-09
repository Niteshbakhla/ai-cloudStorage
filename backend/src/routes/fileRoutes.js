import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { deleteFile, downloadFile, getFiles, getSingleFile, updateFile, uploadFile } from "../controllers/fileController.js";
import { upload } from "../middleware/multerConfig.js";

const router = Router();


router.route("/files").post(isAuthenticated, upload.array("file", 5), uploadFile); // POST /files
router.route("/files").get(isAuthenticated, getFiles);    // GET /files
router.route("/files/:id").delete(isAuthenticated, deleteFile); // DELETE /files/:id
router.route("/files/:id").get(isAuthenticated, getSingleFile).patch(isAuthenticated, updateFile)
router.route("/files/:id/download").get(isAuthenticated, downloadFile)



export default router;