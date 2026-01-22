import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "..", "..", "public", "uploads");

export const removeFile = async(relativePath) => {
    if(!relativePath) return;
    const filePath = path.join(uploadDir, path.basename(relativePath));
    try{
        fs.unlinkSync(filePath);
    }catch(error){
        console.log(error);
    }
}