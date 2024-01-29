import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const userRouter = Router()

userRouter.route('/register').post(
    upload.fields([ // ye code feild me se ye avatar aur coverImage ko leke local public foder me upload kr ke uski path dega..
        {
            name:'avatar',
            maxCount: 1
        },
        {
            name:'coverImage',
            maxCount: 1
        }
    ]),
    registerUser)


export default userRouter