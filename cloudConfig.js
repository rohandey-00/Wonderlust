const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDE_API,
    api_secret: process.env.CLOUDE_API_SECRET
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png", "jpg", "jpeg"]
      
    },
});


module.exports= { cloudinary, storage}

