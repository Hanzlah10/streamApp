import { asyncHandler } from "../utils/asyncHandler.js"


const registerUser = asyncHandler(async (req, res) => {
    
    //get user details form frontend
    //validation-all not empty, email 
    //check if user already exists by username or email
    //check for avatar and coverImage - avatar compulsory
    //upload them to  cloudinary
    //create user object 
    //upload it to db 
    //remove password and refeshToken from the response
    //return res
    // http://localhost:8000/api/v1/users/register
    // {
    //     email: 'hanzalasarguroh@gmail.com',
    //     userName: 'Hanzala Sarguroh',
    //     fullName: 'This is fullName',
    //     password: 'This is pass'
    // }
    

    const {fullName, username , password , email} = req.body
    console.log(req.body);







})



export {registerUser}


