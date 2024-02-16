import { apiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Jwt from "jsonwebtoken"


const options = {
    httpOnly: true,
    secure: true
}


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
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

    const { email, username, password } = req.body
    // console.log(req.body);

    if (!username && !email) {
        throw new apiError(400, "username or email is required")
    }


    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )



    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, "User logged out Successfully")
        )

})

const accessAndRefreshToken = async (req, res) => {
    //take refresh token form cookies or body
    //decode it
    //compare with the db one
    //if same the generate new access token
    //send response

    const incomingRefreshToken = req.cookie?.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized Request")
    }

    const decodedToken = Jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    if (!decodedToken) {
        throw new apiError(401, "Token not decoded!")
    }

    const user = await User.findById(decodedToken?._id)

    if (!user) {
        throw new apiError(401, "Invalid refresh token")
    }

    if (decodedToken !== user?.refreshToken) {
        throw new apiError(401, "Refresh Token is expired or used")
    }

    const { refreshToken, accessToken } = generateAccessAndRefereshTokens(user._id)

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken
                },
                "Access Token Refreshed Successfully"
            )
        )

}

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new apiError(400, "Invalid Password !")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed Successfully")
        )

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current User Fetched")
        )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new apiError(400, "Fullname and email both are mandatory")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        {
            new: true
        }
    ).select("-password")

    user.save({ validateBeforeSave: true })

    return res
        .status(400)
        .json(
            new ApiResponse(400, user, "Updated email and fullName Successfully")
        )

})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new apiError(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")


    return res
        .status(400)
        .json(
            new ApiResponse(400, user, "Avatar Updated Successfully")
        )
})

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new apiError(400, "Cover Image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new apiError(400, "Error while uploading coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")


    return res
        .status(400)
        .json(
            new ApiResponse(400, user, "coverImage Updated Successfully")
        )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params

    if (!username?.trim()) {
        throw new apiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase() //returns an array with one object , bcz here logic is to get username and usename is unique!
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localFeild: "_id",
                foreignFeild: "channel",
                as: "subscribers"  //ye add nhi hoga document me
            }
        },
        {
            $lookup: {
                from: 'subscriptions',
                localFeild: "_id",
                foreignFeild: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFeilds:{ //yaha add hoga..
                subcribersCount:{
                    $size: "$subscribers"
                },
                channelsSubscribedToCount:{
                    $size: "$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if: {$in: [req.user?._id, "$subscribers.subscriber" ]},
                        then : true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullName:1,
                username: 1,
                subcribersCount:1,
                channelsSubscribedToCount:1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                isSubscribed:1,
                createdAt: 1
                
            }
        }

    ])

    if(!channel?.length){
        throw new apiError(400,"channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,channel[0],"Channel Details Fetched Successfully") //as above it return an array with one object so here used channel[0]
    )


})
export {
    registerUser,
    loginUser,
    logoutUser,
    accessAndRefreshToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage
}


