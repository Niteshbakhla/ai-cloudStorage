import multer from "multer";

const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                   
                        cb(null, "src/uploads/");
            },
            filename: function (req, file, cb) {
                        const uniqueName = Date.now() + "-" + file.originalname;
                        cb(null, uniqueName);
            }
});

const fileFilter = (req, file, cb) => {
            const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

            if (allowedTypes.includes(file.mimetype)) {
                        cb(null, true)
            } else {
                        cb(new Error("Only images and PDFs are allowd"), false)
            }
}


export const upload = multer({ storage, fileFilter })