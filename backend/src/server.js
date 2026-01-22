import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Railway: environment variables are already set in process.env
// Local: load from .env.local or .env.production file
if (!process.env.MONGODB_URI) {
    const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
    dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/wbs";
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// MongoDB connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));