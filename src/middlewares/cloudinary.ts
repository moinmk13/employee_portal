import cloudinary from 'cloudinary';
import config from '../config/config';


class CloudinaryUploadFile {
    
    // @ts-ignore
    public upload = cloudinary.config({
        cloud_name : config.cloudinary.cloud_name,
        api_key : config.cloudinary.api_key,
        api_secret : config.cloudinary.api_secret
    });

}

const cloudinaryUpload = new CloudinaryUploadFile();

export default cloudinaryUpload;
