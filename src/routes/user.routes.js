import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
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
userRouter.route('/logout').post(verifyJWT,logoutUser)





export default userRouter