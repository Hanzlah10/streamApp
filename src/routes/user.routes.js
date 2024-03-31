import { Router } from "express";
import { accessAndRefreshToken, changeCurrentPassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, loginUser, logoutUser, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const userRouter = Router()

userRouter.route('/register').post(

    upload.fields([ // ye code feild me se ye avatar aur coverImage ko leke local public foder me upload kr ke uski path dega..
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),

    registerUser)

userRouter.route('/login').post(loginUser)


// secured Routes 
userRouter.route('/logout').post(verifyJWT, logoutUser)
userRouter.route('/refresh-token').post(accessAndRefreshToken)
userRouter.route('/change-password').post(verifyJWT, changeCurrentPassword)
userRouter.route('/current-user').post(verifyJWT, getCurrentUser)
userRouter.route('/update-account').patch(verifyJWT, updateAccountDetails)
userRouter.route('/update-avatar').patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
userRouter.route('/update-converImage').patch(verifyJWT, upload.single("coverImage"), updateUserAvatar)
userRouter.route('/channel/:username').get(verifyJWT, getUserChannelProfile)
userRouter.route('history').get(verifyJWT, getUserWatchHistory)


export default userRouter