import { apiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"




const generateAccessandRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refeshToken = user.generateRefreshToken()

        user.refeshToken = refeshToken
        await user.save( {ValidateBeforeSave : false} )

        return {refeshToken, accessToken}
        
    } catch (error) {
        throw new apiError(500, "something went wrong while generating Access and Refresh Tokens")
    }
}

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



    const { fullName, username, password, email } = req.body

    if ([fullName, username, password, email].some((feild) => feild?.trim() === "")) {
        throw new apiError(400, "All fields are required !")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User with Username or Email Already Exists !")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverLocalPath

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverLocalPath = req.files?.coverImage[0]?.path
    }

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar path  is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)



    if (!avatar) {
        throw new apiError(400, "Avatar is required")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, "User Registered Successfully", createdUser)
    )

})

const loginUser = asyncHandler(async (req, res) => {


    //get data from frontend for login
    //validation
    //check if user is already present
    //password check
    //generate access and refresh token
    //send using cookie

    const { username, password, email } = req.body


    console.log(username, email, password)

    if (!username && !email) {
        throw new apiError(400, "At least email or username is required. theek hia")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(401, "Invalid Password")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .cookie("Access Token", accessToken,options)
    .cookie("Refresh Token", refreshToken,options)
    .json(
        new ApiResponse(200 , {
            loggedInUser, accessToken , refreshToken
        },"User logged in Successfully")
    )

})


export { registerUser, loginUser }


