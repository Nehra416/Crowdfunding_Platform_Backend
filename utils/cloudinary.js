const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadToCloudinary = async (imagePath) => {
    console.log("cloud path", imagePath)
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            quality: "auto",
            folder: "CRD",
            resource_type: 'image'
        });

        return result?.secure_url;
    } catch (error) {
        console.log("Error in uploading image:", error);
        return "Error in uploading image"
    }
};

module.exports = uploadToCloudinary;