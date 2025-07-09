
class CustomError extends Error {
            constructor(message, statusCode) {
                        super(message)
                        this.statusCode = statusCode;

                        Error.captureStackTrace(this, this.constructor);
            }

            toJSON() {
                        return {
                                    message: this.message,
                        };
            }
}
export default CustomError;