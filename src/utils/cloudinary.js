import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'  

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,  
  api_secret: process.env.CLOUDINARY_API_SECRET  //just check the api key in .env if code doent work
});


const uploadOnCloudinary = async(localFilePath) => {

  try {

    if (!localFilePath) return null

    // upload file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type:'auto'
    })

    console.log("File Uploaded Successfully",response.url);
    return response

  } catch (error) {
    //remove the locally saved filepath as uploading failed(this will not remove the actual file but just the path or link to it)
     fs.unlink(localFilePath)  
     return null
  }


} 
 
export {uploadOnCloudinary}