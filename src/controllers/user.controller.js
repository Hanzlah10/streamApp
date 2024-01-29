import { apiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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



    const { fullName, username, password, email } = req.body

    if ([fullName, username, password, email].some((feild) => feild?.trim() === "")) {
        throw new apiError(400, "All fields are required !")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User with Username or Email Already Exists !")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar is required")
    }

    const user = User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,"User Registered Successfully",createdUser)
    )
    
})



export { registerUser }


