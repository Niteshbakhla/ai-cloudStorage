import { app } from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/db/db.js";
connectDB()

const PORT = config.PORT

app.listen(PORT, () => {
            console.log(`Server is listening at port ${PORT}`);
});