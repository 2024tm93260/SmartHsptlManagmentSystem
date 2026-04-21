import "dotenv/config";
import connectdb from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
    try {
        await connectdb();
        app.listen(PORT, () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
            console.log(`📝 Environment: ${NODE_ENV}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
