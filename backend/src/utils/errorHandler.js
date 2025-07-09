
const errorHandler = (err, req, res, next) => {
            const statusCode = err.statusCode || 500;
            let message = err.message || "Internal server error"

            if (err.name === "ValidationError") {
                        statusCode = 400;
                        message = Object.values(err.errors).map(e => e.message).join(",  ");
            }

            res.status(statusCode).json({ success: false, message });
}

export default errorHandler