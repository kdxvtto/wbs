import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.resolve(__dirname, "..", "..", "public", "uploads");

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const allowedTypes = new Set(["image/jpeg", "image/png", "image/jpg", "image/webp"]);

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename : (req, file, cb) => {
        const extFile = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${crypto.randomInt(1000)}${extFile}`;
        cb(null, uniqueName);
    }
});

const filterFile = (req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)){
        return cb(new Error("Invalid file type"));
    }
    cb(null, true);
}

export const upload = multer({
    storage : storage,
    fileFilter : filterFile,
    limits : {
        fileSize : 5 * 1024 * 1024
    }
})

        