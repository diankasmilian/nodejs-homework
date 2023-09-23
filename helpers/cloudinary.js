import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv';

dotenv.config();

const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_SECRET} = process.env;

cloudinary.config({
   cloud_name: CLOUDINARY_CLOUD_NAME,
   api_key: CLOUDINARY_API_KEY,
   api_secret: CLOUDINARY_CLOUD_SECRET
})

export default cloudinary;