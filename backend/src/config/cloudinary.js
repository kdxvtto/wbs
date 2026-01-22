import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import multer from "multer";

//Cloudinary configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

//Cloudinary storage for complaint images
const complaintStorage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : "bankwonogiri/complaints",
        allowed_formats : ["png", "jpg", "jpeg", "gif", "webp"],
        transformation : [{width : 500, height : 500, crop : "limit"}]
    }
})

// Multer storage for complaint images
export const complaintUpload = multer({
    storage : complaintStorage,
    limits : {
        fileSize : 5 * 1024 * 1024
    }
})
// Delete cloudinary image
export const deleteCloudinaryImage = async (public_id, resource_type = "image") => {
    try {
        if (public_id){
            await cloudinary.uploader.destroy(public_id, { resource_type });
        }
    } catch (error) {
        console.log("Error deleting cloudinary image", error);
    }
}

export const getPublicIdFromUrl = (url) => {
    // Match everything after /v[version]/ until the file extension
    // Example: https://res.cloudinary.com/xxx/image/upload/v1234/bankwonogiri/complaints/abc123.jpg
    // Should return: bankwonogiri/complaints/abc123
    const match = url.match(/\/v\d+\/(.+)\.[a-zA-Z]+$/);
    return match ? match[1] : null;
}